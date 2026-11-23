import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from .admin import cellule_sure
from .models import PieceJustificative, PreInscription

PDF = b'%PDF-1.4 test'
PNG = b'\x89PNG\r\n\x1a\n' + b'0' * 20
JPG = b'\xff\xd8\xff\xe0' + b'0' * 20

MEDIA_TEMP = tempfile.mkdtemp()


def fichier(nom, contenu):
    return SimpleUploadedFile(nom, contenu)


def donnees(**extra):
    d = {
        'niveau': 'BTS', 'filiere_id': 'bts-ida', 'filiere_nom': "BTS Informatique Développeur d'Application",
        'campus_id': 'campus-gagnoa', 'campus_nom': 'Campus ISTAG — Gagnoa Garahio', 'regime': 'Cours du jour',
        'nom': 'Kouassi', 'prenoms': 'Jean-Marc', 'date_naissance': '2006-05-12', 'genre': 'Masculin',
        'nationalite': 'Ivoirienne', 'telephone': '+225 07 07 07 07 07', 'whatsapp': '', 'email': '',
        'ville_residence': 'Gagnoa', 'dernier_diplome': 'Baccalauréat', 'serie': 'Série D',
        'etablissement_origine': 'Lycée Moderne de Gagnoa', 'annee_obtention': '2026', 'mention': 'Passable',
        'consentement': 'true',
        'piece_acte_naissance': fichier('acte.pdf', PDF),
        'piece_diplome': fichier('bac.jpg', JPG),
        'piece_identite': fichier('cni.png', PNG),
        'piece_photo': fichier('photo.jpg', JPG),
    }
    d.update(extra)
    return {k: v for k, v in d.items() if v is not None}


@override_settings(MEDIA_ROOT=MEDIA_TEMP)
class PreInscriptionApiTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA_TEMP, ignore_errors=True)

    def setUp(self):
        cache.clear()  # remet à zéro les limites anti-spam

    def deposer(self, **extra):
        return self.client.post(reverse('preinscription-create'), donnees(**extra))

    def test_depot_complet_genere_un_numero_officiel(self):
        r = self.deposer()
        self.assertEqual(r.status_code, 201, r.content)
        dossier = PreInscription.objects.get()
        self.assertEqual(r.json()['numero_dossier'], dossier.numero_dossier)
        self.assertEqual(dossier.numero_dossier, f'ISTAG-{timezone.now().year}-{dossier.pk:04d}')
        self.assertEqual(dossier.statut, PreInscription.Statut.RECUE)
        self.assertEqual(dossier.telephone_normalise, '0707070707')
        self.assertEqual(dossier.pieces.count(), 4)

    def test_piece_obligatoire_manquante(self):
        r = self.deposer(piece_identite=None)
        self.assertEqual(r.status_code, 400)
        self.assertIn('piece_identite', r.json())
        self.assertFalse(PreInscription.objects.exists())

    def test_diplome_facultatif_si_en_cours_obtention(self):
        self.assertEqual(self.deposer(piece_diplome=None).status_code, 400)
        r = self.deposer(piece_diplome=None, mention="En cours d'obtention")
        self.assertEqual(r.status_code, 201, r.content)

    def test_faux_fichier_refuse(self):
        r = self.deposer(piece_photo=fichier('photo.jpg', b'MZ executable'))
        self.assertEqual(r.status_code, 400)
        self.assertIn('piece_photo', r.json())

    def test_extension_interdite(self):
        r = self.deposer(piece_photo=fichier('photo.exe', JPG))
        self.assertEqual(r.status_code, 400)

    @override_settings(ADMISSIONS_TAILLE_MAX_PIECE=10)
    def test_fichier_trop_lourd(self):
        self.assertEqual(self.deposer().status_code, 400)

    def test_consentement_obligatoire(self):
        r = self.deposer(consentement='false')
        self.assertEqual(r.status_code, 400)
        self.assertIn('consentement', r.json())

    def test_champ_piege_anti_robot(self):
        self.assertEqual(self.deposer(site_web='http://spam.example').status_code, 400)

    # --- Suivi -----------------------------------------------------------
    def test_suivi_avec_numero_et_telephone(self):
        numero = self.deposer().json()['numero_dossier']
        dossier = PreInscription.objects.get()
        dossier.notes_internes = 'Secret scolarité'
        dossier.message_candidat = 'Merci de passer au guichet.'
        dossier.save()

        r = self.client.post(reverse('preinscription-suivi'),
                             {'numero': numero.lower(), 'telephone': '0707070707'},
                             content_type='application/json')
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data['statut'], 'recue')
        self.assertEqual(data['message_candidat'], 'Merci de passer au guichet.')
        self.assertNotIn('notes_internes', data)
        self.assertEqual(len(data['pieces']), 4)

    def test_suivi_refuse_si_mauvais_telephone(self):
        numero = self.deposer().json()['numero_dossier']
        r = self.client.post(reverse('preinscription-suivi'),
                             {'numero': numero, 'telephone': '0101010101'},
                             content_type='application/json')
        self.assertEqual(r.status_code, 404)

    def test_renvoi_piece_non_conforme(self):
        numero = self.deposer().json()['numero_dossier']
        dossier = PreInscription.objects.get()
        dossier.statut = PreInscription.Statut.A_COMPLETER
        dossier.save()
        photo = dossier.pieces.get(type_piece='photo')
        ancien_fichier = photo.fichier.name
        photo.statut = PieceJustificative.Statut.NON_CONFORME
        photo.commentaire = 'Photo floue'
        photo.save()

        with self.captureOnCommitCallbacks(execute=True):
            r = self.client.post(reverse('preinscription-piece'), {
                'numero': numero, 'telephone': '07 07 07 07 07',
                'type_piece': 'photo', 'fichier': fichier('nouvelle.png', PNG),
            })
        self.assertEqual(r.status_code, 200, r.content)
        photo.refresh_from_db()
        dossier.refresh_from_db()
        self.assertEqual(photo.statut, PieceJustificative.Statut.EN_ATTENTE)
        self.assertEqual(photo.commentaire, '')
        self.assertNotEqual(photo.fichier.name, ancien_fichier)
        self.assertFalse(photo.fichier.storage.exists(ancien_fichier))
        self.assertEqual(dossier.statut, PreInscription.Statut.EN_EXAMEN)

    def test_piece_conforme_ne_peut_pas_etre_remplacee(self):
        numero = self.deposer().json()['numero_dossier']
        PieceJustificative.objects.filter(type_piece='photo').update(statut='conforme')
        r = self.client.post(reverse('preinscription-piece'), {
            'numero': numero, 'telephone': '0707070707',
            'type_piece': 'photo', 'fichier': fichier('n.png', PNG),
        })
        self.assertEqual(r.status_code, 400)

    # --- Accès aux documents ---------------------------------------------
    def test_documents_reserves_au_personnel(self):
        self.deposer()
        piece = PieceJustificative.objects.first()
        url = reverse('piece-fichier', args=[piece.pk])

        self.assertEqual(self.client.get(url).status_code, 302)  # renvoyé vers la connexion

        User = get_user_model()
        User.objects.create_user('agent', password='x', is_staff=True)
        self.client.login(username='agent', password='x')
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        r.close()

    def test_admin_liste_et_fiche(self):
        self.deposer()
        User = get_user_model()
        User.objects.create_superuser('admin', password='x')
        self.client.login(username='admin', password='x')
        dossier = PreInscription.objects.get()
        self.assertEqual(self.client.get(reverse('admin:admissions_preinscription_changelist')).status_code, 200)
        self.assertEqual(
            self.client.get(reverse('admin:admissions_preinscription_change', args=[dossier.pk])).status_code, 200
        )

    def test_suppression_efface_les_fichiers(self):
        self.deposer()
        dossier = PreInscription.objects.get()
        chemins = [p.fichier.name for p in dossier.pieces.all()]
        stockage = dossier.pieces.first().fichier.storage
        dossier.delete()
        self.assertFalse(any(stockage.exists(c) for c in chemins))


class ExportCsvTests(TestCase):
    def test_formules_neutralisees(self):
        self.assertEqual(cellule_sure('=HYPERLINK("x")'), '\'=HYPERLINK("x")')
        self.assertEqual(cellule_sure('+225 07 07 07 07 07'), '+225 07 07 07 07 07')
        self.assertEqual(cellule_sure('Kouassi'), 'Kouassi')


@override_settings(MEDIA_ROOT=MEDIA_TEMP)
class DecisionsAdminTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client.post(reverse('preinscription-create'), donnees())
        self.dossier = PreInscription.objects.get()
        self.admin = get_user_model().objects.create_superuser('admin.istag', password='x')
        self.client.force_login(self.admin)
        self.url_approuver = reverse('admin:admissions_preinscription_approuver', args=[self.dossier.pk])
        self.url_valider = reverse('admin:admissions_preinscription_valider', args=[self.dossier.pk])

    def test_statut_par_defaut_en_attente_de_traitement(self):
        self.assertEqual(self.dossier.get_statut_display(), 'En attente de traitement')

    def test_fiche_affiche_le_bouton_approuver(self):
        r = self.client.get(reverse('admin:admissions_preinscription_change', args=[self.dossier.pk]))
        self.assertContains(r, 'Approuver le dossier')
        self.assertNotContains(r, "Valider l&#x27;inscription")

    def test_approuver_puis_valider(self):
        self.client.post(self.url_approuver)
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.ADMIS)
        self.assertEqual(self.dossier.traite_par, self.admin)
        self.assertTrue(self.dossier.message_candidat)
        self.assertFalse(self.dossier.pieces.exclude(statut='conforme').exists())

        self.client.post(self.url_valider)
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.INSCRIT)

    def test_valider_impossible_avant_approbation(self):
        self.client.post(self.url_valider)
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.RECUE)

    def test_approbation_bloquee_si_piece_non_conforme(self):
        self.dossier.pieces.filter(type_piece='photo').update(statut='non_conforme')
        self.client.post(self.url_approuver)
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.RECUE)

    def test_get_refuse(self):
        self.assertEqual(self.client.get(self.url_approuver).status_code, 405)

    def test_personnel_sans_droit_de_modification(self):
        agent = get_user_model().objects.create_user('agent', password='x', is_staff=True)
        self.client.force_login(agent)
        self.assertEqual(self.client.post(self.url_approuver).status_code, 403)


@override_settings(MEDIA_ROOT=MEDIA_TEMP)
class BackOfficeTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client.post(reverse('preinscription-create'), donnees())
        self.dossier = PreInscription.objects.get()
        self.admin = get_user_model().objects.create_superuser('admin.istag', password='x')
        self.client.force_login(self.admin)
        self.fiche = reverse('admin:admissions_preinscription_change', args=[self.dossier.pk])

    def url_piece(self, type_piece):
        piece = self.dossier.pieces.get(type_piece=type_piece)
        return reverse('admin:admissions_preinscription_piece', args=[self.dossier.pk, piece.pk])

    def test_tableau_de_bord(self):
        r = self.client.get(reverse('admin:index'))
        self.assertContains(r, 'Nouveaux dossiers')
        self.assertContains(r, 'KOUASSI Jean-Marc')  # dans « À traiter en priorité »

    def test_liste_avec_onglets(self):
        r = self.client.get(reverse('admin:admissions_preinscription_changelist') + '?statut__exact=recue')
        self.assertContains(r, 'En attente du candidat')
        self.assertContains(r, 'KOUASSI Jean-Marc')

    def test_fiche_affiche_photo_et_pieces(self):
        r = self.client.get(self.fiche)
        self.assertContains(r, 'Pièces justificatives')
        self.assertContains(r, 'Photo du candidat')
        self.assertContains(r, 'Lycée Moderne de Gagnoa')

    def test_refuser_puis_accepter_une_piece(self):
        r = self.client.post(self.url_piece('photo'), {'decision': 'non_conforme', 'motif': 'Photo floue'})
        self.assertRedirects(r, self.fiche + '#pieces', fetch_redirect_response=False)
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.A_COMPLETER)
        self.assertEqual(self.dossier.pieces.get(type_piece='photo').commentaire, 'Photo floue')

        self.client.post(self.url_piece('photo'), {'decision': 'conforme'})
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.EN_EXAMEN)

    def test_refus_sans_motif_impossible(self):
        self.client.post(self.url_piece('photo'), {'decision': 'non_conforme', 'motif': ''})
        self.assertEqual(self.dossier.pieces.get(type_piece='photo').statut, 'en_attente')

    def test_rejeter_avec_motif_puis_annuler(self):
        url = reverse('admin:admissions_preinscription_rejeter', args=[self.dossier.pk])
        self.client.post(url, {'motif': ''})
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.RECUE)

        self.client.post(url, {'motif': 'Niveau insuffisant'})
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.REJETEE)
        self.assertEqual(self.dossier.message_candidat, 'Niveau insuffisant')

        self.client.post(reverse('admin:admissions_preinscription_rouvrir', args=[self.dossier.pk]))
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.EN_EXAMEN)

    def test_enregistrer_messages_reste_sur_la_fiche(self):
        r = self.client.post(self.fiche, {'message_candidat': 'Passez demain', 'notes_internes': 'RAS', '_save': '1'})
        self.assertRedirects(r, self.fiche, fetch_redirect_response=False)
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.message_candidat, 'Passez demain')
        self.assertEqual(self.dossier.nom, 'Kouassi')  # infos du candidat intactes

    def test_page_de_connexion(self):
        self.client.logout()
        self.assertContains(self.client.get(reverse('admin:login')), 'Scolarité')


@override_settings(MEDIA_ROOT=MEDIA_TEMP)
class ListesTailwindTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client.post(reverse('preinscription-create'), donnees())
        self.dossier = PreInscription.objects.get()
        self.admin = get_user_model().objects.create_superuser('admin.istag', password='x', first_name='Yacouba')
        self.client.force_login(self.admin)
        self.liste = reverse('admin:admissions_preinscription_changelist')

    def test_liste_dossiers_tailwind(self):
        r = self.client.get(self.liste)
        self.assertContains(r, 'Dossiers des candidats')
        self.assertContains(r, 'name="_selected_action"')
        self.assertContains(r, 'Tableau de bord')  # barre de navigation commune

    def test_recherche_sans_resultat(self):
        r = self.client.get(self.liste + '?q=inexistant')
        self.assertContains(r, 'Aucun dossier ici')

    def test_action_groupee_depuis_la_nouvelle_liste(self):
        r = self.client.post(self.liste, {
            'action': 'approuver_selection', 'index': '0', 'select_across': '0',
            '_selected_action': [self.dossier.pk],
        })
        self.assertEqual(r.status_code, 302)
        self.dossier.refresh_from_db()
        self.assertEqual(self.dossier.statut, PreInscription.Statut.ADMIS)

    def test_export_csv_depuis_la_nouvelle_liste(self):
        r = self.client.post(self.liste, {
            'action': 'exporter_csv', 'index': '0', 'select_across': '0',
            '_selected_action': [self.dossier.pk],
        })
        self.assertEqual(r['Content-Type'], 'text/csv; charset=utf-8')

    def test_comptes_du_personnel(self):
        r = self.client.get(reverse('admin:auth_user_changelist'))
        self.assertContains(r, 'Comptes du personnel')
        self.assertContains(r, 'Administrateur')
        self.assertContains(r, 'Ajouter un compte')

    def test_formulaire_compte_avec_nouvelle_navigation(self):
        r = self.client.get(reverse('admin:auth_user_change', args=[self.admin.pk]))
        self.assertContains(r, 'tailwind-admin.css')
        self.assertContains(r, 'Comptes du personnel')


class StockageVercelBlobTests(TestCase):
    """L'adaptateur Vercel Blob, avec un faux service en mémoire."""

    def setUp(self):
        from types import SimpleNamespace
        from unittest import mock

        from vercel.blob import BlobNotFoundError

        from config import stockage

        self.fichiers = {}
        self.appels_put = []

        def put_blob(name, data, *, access, content_type=None, **kw):
            self.appels_put.append((name, access, content_type))
            self.fichiers[name] = data
            return SimpleNamespace(pathname=name)

        def lire(name, access=None):
            if name not in self.fichiers:
                raise BlobNotFoundError('absent')
            return SimpleNamespace(body=self.fichiers[name], size=len(self.fichiers[name]))

        faux = SimpleNamespace(
            put_blob=put_blob,
            get_blob=lambda name, *, access: lire(name, access),
            head_blob=lire,
            delete_blob=lambda name: self.fichiers.pop(name, None),
        )
        patch = mock.patch.object(stockage, 'blob', faux)
        patch.start()
        self.addCleanup(patch.stop)
        self.stockage = stockage.VercelBlobPriveStorage()

    def test_enregistre_en_prive_relit_et_supprime(self):
        nom = self.stockage.save('pieces/1/photo-ab.png', SimpleUploadedFile('p.png', b'\x89PNG\r\n\x1a\nxx'))
        self.assertEqual(self.appels_put, [('pieces/1/photo-ab.png', 'private', 'image/png')])
        self.assertTrue(self.stockage.exists(nom))
        self.assertEqual(self.stockage.size(nom), 10)
        with self.stockage.open(nom) as fh:
            self.assertEqual(fh.read(), b'\x89PNG\r\n\x1a\nxx')
        self.stockage.delete(nom)
        self.assertFalse(self.stockage.exists(nom))

    def test_fichier_absent(self):
        with self.assertRaises(FileNotFoundError):
            self.stockage.open('pieces/inconnu.pdf')
