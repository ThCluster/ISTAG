import csv
import re

from django.contrib import admin, messages
from django.contrib.admin.exceptions import NotRegistered
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404, redirect
from django.urls import path, reverse
from django.utils import timezone
from django.utils.html import format_html, format_html_join

from .models import PieceJustificative, PreInscription
from .ui import PASTILLE_PIECE, ListeTailwindMixin, badge_statut

Statut = PreInscription.Statut
StatutPiece = PieceJustificative.Statut
TypePiece = PieceJustificative.Type

# Les droits sont donnés directement à chaque compte : le menu « Groupes » est inutile.
try:
    admin.site.unregister(Group)
except NotRegistered:
    pass

# Ordre d'affichage des pièces + lettre utilisée dans la liste des dossiers.
ORDRE_PIECES = [
    (TypePiece.PHOTO, 'P'),
    (TypePiece.ACTE_NAISSANCE, 'A'),
    (TypePiece.DIPLOME, 'D'),
    (TypePiece.PIECE_IDENTITE, 'C'),
]

# Onglets de la liste des dossiers (mêmes libellés que le tableau de bord).
ONGLETS = [
    ('', 'Tous'),
    (Statut.RECUE, 'Nouveaux'),
    (Statut.EN_EXAMEN, 'En cours'),
    (Statut.A_COMPLETER, 'En attente du candidat'),
    (Statut.ADMIS, 'Approuvés'),
    (Statut.INSCRIT, 'Inscrits'),
    (Statut.REJETEE, 'Rejetés'),
]


def cellule_sure(valeur):
    """Empêche Excel d'interpréter une saisie du candidat comme une formule."""
    texte = str(valeur)
    if texte[:1] in ('=', '@', chr(9), chr(13)) or re.match(r'^[+-](?![\d\s]+$)', texte):
        return "'" + texte
    return texte


def lien_whatsapp(numero):
    chiffres = ''.join(c for c in numero if c.isdigit())
    if len(chiffres) == 10:  # numéro ivoirien sans indicatif
        chiffres = '225' + chiffres
    return f'https://wa.me/{chiffres}'


class PiecesAVerifierFilter(admin.SimpleListFilter):
    title = 'pièces'
    parameter_name = 'pieces'

    def lookups(self, request, model_admin):
        return [('a_verifier', 'Au moins une pièce à vérifier'),
                ('non_conforme', 'Au moins une pièce refusée')]

    def queryset(self, request, qs):
        if self.value() == 'a_verifier':
            return qs.filter(pieces__statut=StatutPiece.EN_ATTENTE).distinct()
        if self.value() == 'non_conforme':
            return qs.filter(pieces__statut=StatutPiece.NON_CONFORME).distinct()
        return qs


@admin.register(PreInscription)
class PreInscriptionAdmin(ListeTailwindMixin, admin.ModelAdmin):
    # --- Liste des dossiers ----------------------------------------------
    list_display = ['photo_miniature', 'candidat', 'filiere_nom', 'telephone_lien',
                    'statut_badge', 'pieces_pastilles', 'recu_le', 'bouton_ouvrir']
    list_display_links = ['candidat']
    list_filter = [PiecesAVerifierFilter, 'filiere_nom', ('date_creation', admin.DateFieldListFilter)]
    search_fields = ['numero_dossier', 'nom', 'prenoms', 'telephone', 'whatsapp', 'email']
    list_per_page = 30
    actions = ['approuver_selection', 'exporter_csv']
    change_list_template = 'admin/admissions/preinscription/change_list.html'

    # --- Fiche : seuls les messages sont modifiables dans le formulaire ----
    # (les décisions passent par les boutons, les infos du candidat restent intactes)
    fields = ['message_candidat', 'notes_internes']

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('pieces').select_related('traite_par')

    def has_add_permission(self, request):
        return False  # Les dossiers sont créés par les candidats depuis le site.

    def preparer_ligne(self, d):
        d.badge_classes = badge_statut(d.statut)
        d.pastilles = []
        for type_piece, lettre in ORDRE_PIECES:
            piece = d.piece(type_piece)
            etat = piece.statut if piece else 'manquante'
            d.pastilles.append({
                'lettre': lettre,
                'classes': PASTILLE_PIECE[etat],
                'titre': f'{TypePiece(type_piece).label} : '
                         + (piece.get_statut_display() if piece else 'non fournie'),
            })

    # --- Colonnes de la liste --------------------------------------------
    @admin.display(description='')
    def photo_miniature(self, obj):
        photo = obj.photo
        if photo and photo.est_image:
            return format_html('<img class="avatar" src="{}" alt="">', reverse('piece-fichier', args=[photo.pk]))
        return format_html('<span class="avatar avatar-vide">{}</span>', obj.initiales)

    @admin.display(description='Candidat', ordering='nom')
    def candidat(self, obj):
        return format_html('<span class="cellule-candidat"><strong>{}</strong><span class="numero">{}</span></span>',
                           obj.nom_complet, obj.numero_dossier)

    @admin.display(description='Téléphone')
    def telephone_lien(self, obj):
        return format_html('<a href="tel:{}">{}</a>', obj.telephone.replace(' ', ''), obj.telephone)

    @admin.display(description='Statut', ordering='statut')
    def statut_badge(self, obj):
        return format_html('<span class="badge badge-{}">{}</span>', obj.statut, obj.get_statut_display())

    @admin.display(description='Pièces')
    def pieces_pastilles(self, obj):
        elements = []
        for type_piece, lettre in ORDRE_PIECES:
            piece = obj.piece(type_piece)
            etat = piece.statut if piece else 'manquante'
            titre = f'{TypePiece(type_piece).label} : ' + (piece.get_statut_display() if piece else 'non fournie')
            elements.append((etat, titre, lettre))
        return format_html('<span class="pastilles">{}</span>', format_html_join(
            '', '<span class="pastille pastille-{}" title="{}">{}</span>', elements))

    @admin.display(description='Reçu le', ordering='date_creation')
    def recu_le(self, obj):
        return timezone.localtime(obj.date_creation).strftime('%d/%m/%Y')

    @admin.display(description='')
    def bouton_ouvrir(self, obj):
        return format_html('<a class="bouton bouton-vert bouton-petit" href="{}">Ouvrir</a>',
                           reverse('admin:admissions_preinscription_change', args=[obj.pk]))

    # --- Onglets par statut au-dessus de la liste -------------------------
    def changelist_view(self, request, extra_context=None):
        statut_actif = request.GET.get('statut__exact', '')
        comptes = {s: 0 for s, _ in ONGLETS}
        for statut in PreInscription.objects.values_list('statut', flat=True):
            comptes[statut] = comptes.get(statut, 0) + 1
        comptes[''] = sum(v for k, v in comptes.items() if k)
        base = reverse('admin:admissions_preinscription_changelist')
        extra_context = {
            **(extra_context or {}),
            'onglets': [
                {'libelle': libelle, 'nombre': comptes.get(statut, 0),
                 'url': f'{base}?statut__exact={statut}' if statut else base,
                 'actif': statut == statut_actif}
                for statut, libelle in ONGLETS
            ],
            'title': 'Dossiers de pré-inscription',
        }
        return super().changelist_view(request, extra_context)

    # --- Fiche dossier ----------------------------------------------------
    def change_view(self, request, object_id, form_url='', extra_context=None):
        dossier = self.get_object(request, object_id)
        if dossier is not None:
            pieces = []
            for type_piece, _ in ORDRE_PIECES:
                piece = dossier.piece(type_piece)
                pieces.append({
                    'type': type_piece,
                    'libelle': TypePiece(type_piece).label,
                    'piece': piece,
                    'url': reverse('piece-fichier', args=[piece.pk]) if piece else None,
                    'url_verifier': reverse('admin:admissions_preinscription_piece',
                                            args=[dossier.pk, piece.pk]) if piece else None,
                    'facultative': type_piece == TypePiece.DIPLOME and dossier.diplome_facultatif,
                })
            url = lambda nom: reverse(f'admin:admissions_preinscription_{nom}', args=[dossier.pk])  # noqa: E731
            extra_context = {
                **(extra_context or {}),
                'dossier': dossier,
                'pieces': pieces,
                'modifiable': self.has_change_permission(request, dossier),
                'tel': dossier.telephone.replace(' ', ''),
                'whatsapp': lien_whatsapp(dossier.whatsapp or dossier.telephone),
                'raison_pas_approuver': dossier.peut_approuver(),
                'url_approuver': url('approuver'),
                'url_valider': url('valider'),
                'url_rejeter': url('rejeter'),
                'url_rouvrir': url('rouvrir'),
                'title': dossier.nom_complet,
            }
        return super().change_view(request, object_id, form_url, extra_context)

    def save_model(self, request, obj, form, change):
        if change and form.changed_data:
            obj.traite_par = request.user
        super().save_model(request, obj, form, change)

    def response_change(self, request, obj):
        # Après « Enregistrer les messages », on reste sur la fiche.
        self.message_user(request, 'Messages enregistrés.', messages.SUCCESS)
        return redirect(request.path)

    # --- Boutons de décision ----------------------------------------------
    def get_urls(self):
        vue = self.admin_site.admin_view
        nom = 'admissions_preinscription_'
        return [
            path('<int:pk>/approuver/', vue(self.approuver_view), name=nom + 'approuver'),
            path('<int:pk>/valider/', vue(self.valider_view), name=nom + 'valider'),
            path('<int:pk>/rejeter/', vue(self.rejeter_view), name=nom + 'rejeter'),
            path('<int:pk>/rouvrir/', vue(self.rouvrir_view), name=nom + 'rouvrir'),
            path('<int:pk>/pieces/<int:piece_pk>/', vue(self.piece_view), name=nom + 'piece'),
        ] + super().get_urls()

    def _dossier_modifiable(self, request, pk):
        if request.method != 'POST':
            return None, HttpResponseNotAllowed(['POST'])
        dossier = get_object_or_404(PreInscription, pk=pk)
        if not self.has_change_permission(request, dossier):
            raise PermissionDenied
        return dossier, None

    def _retour(self, dossier, ancre=''):
        return redirect(reverse('admin:admissions_preinscription_change', args=[dossier.pk]) + ancre)

    def _decision(self, request, pk, verifier, appliquer, succes):
        dossier, erreur = self._dossier_modifiable(request, pk)
        if erreur:
            return erreur
        probleme = verifier(dossier)
        if probleme:
            self.message_user(request, probleme, messages.ERROR)
        else:
            appliquer(dossier)
            self.message_user(request, succes.format(dossier=dossier), messages.SUCCESS)
        return self._retour(dossier)

    def approuver_view(self, request, pk):
        return self._decision(
            request, pk, PreInscription.peut_approuver, lambda d: d.approuver(request.user),
            'Dossier de {dossier.nom_complet} approuvé. Le candidat le verra en consultant son dossier.',
        )

    def valider_view(self, request, pk):
        return self._decision(
            request, pk, PreInscription.peut_valider, lambda d: d.valider(request.user),
            'Inscription de {dossier.nom_complet} validée définitivement.',
        )

    def rouvrir_view(self, request, pk):
        return self._decision(
            request, pk, PreInscription.peut_rouvrir, lambda d: d.rouvrir(request.user),
            'Décision annulée : le dossier de {dossier.nom_complet} est de nouveau « en cours d’examen ».',
        )

    def rejeter_view(self, request, pk):
        motif = request.POST.get('motif', '').strip()

        def verifier(dossier):
            return dossier.peut_rejeter() or (None if motif else 'Indiquez le motif du rejet pour le candidat.')

        return self._decision(
            request, pk, verifier, lambda d: d.rejeter(request.user, motif),
            'Dossier de {dossier.nom_complet} rejeté. Le candidat verra le motif en ligne.',
        )

    def piece_view(self, request, pk, piece_pk):
        dossier, erreur = self._dossier_modifiable(request, pk)
        if erreur:
            return erreur
        piece = get_object_or_404(PieceJustificative, pk=piece_pk, preinscription=dossier)
        conforme = request.POST.get('decision') == 'conforme'
        motif = request.POST.get('motif', '').strip()[:255]
        if not conforme and not motif:
            self.message_user(request, 'Indiquez pourquoi la pièce est refusée (le candidat verra ce motif).',
                              messages.ERROR)
        else:
            dossier.verifier_piece(piece, conforme, motif, request.user)
            if conforme:
                self.message_user(request, f'{piece} : conforme.', messages.SUCCESS)
            else:
                self.message_user(request, f'{piece} refusée. Le dossier passe « à compléter » : '
                                           'le candidat voit le motif et peut renvoyer le document.',
                                  messages.WARNING)
        return self._retour(dossier, '#pieces')

    # --- Actions groupées -------------------------------------------------
    @admin.action(description='Approuver les dossiers sélectionnés')
    def approuver_selection(self, request, queryset):
        ok, refus = 0, []
        for dossier in queryset:
            probleme = dossier.peut_approuver()
            if probleme:
                refus.append(f'{dossier.nom_complet} : {probleme}')
            else:
                dossier.approuver(request.user)
                ok += 1
        if ok:
            self.message_user(request, f'{ok} dossier(s) approuvé(s).', messages.SUCCESS)
        for r in refus:
            self.message_user(request, r, messages.WARNING)

    @admin.action(description='Exporter la sélection (Excel)')
    def exporter_csv(self, request, queryset):
        reponse = HttpResponse(content_type='text/csv; charset=utf-8')
        reponse['Content-Disposition'] = (
            f'attachment; filename="preinscriptions-{timezone.localdate():%Y-%m-%d}.csv"'
        )
        reponse.write('﻿')  # BOM pour qu'Excel lise bien les accents
        writer = csv.writer(reponse, delimiter=';')
        colonnes = [
            ('N° dossier', 'numero_dossier'), ('Statut', 'get_statut_display'),
            ('Nom', 'nom'), ('Prénoms', 'prenoms'), ('Date de naissance', 'date_naissance'),
            ('Genre', 'genre'), ('Nationalité', 'nationalite'), ('Téléphone', 'telephone'),
            ('WhatsApp', 'whatsapp'), ('Email', 'email'), ('Ville', 'ville_residence'),
            ('Cycle', 'niveau'), ('Filière', 'filiere_nom'), ('Campus', 'campus_nom'),
            ('Régime', 'regime'), ('Dernier diplôme', 'dernier_diplome'), ('Série', 'serie'),
            ("Établissement d'origine", 'etablissement_origine'), ('Année', 'annee_obtention'),
            ('Mention', 'mention'), ('Reçue le', 'date_creation'),
        ]
        writer.writerow([titre for titre, _ in colonnes])
        for d in queryset:
            ligne = []
            for _, attr in colonnes:
                v = getattr(d, attr)
                v = v() if callable(v) else v
                if attr == 'date_creation':
                    v = timezone.localtime(v).strftime('%d/%m/%Y %H:%M')
                ligne.append('' if v is None else cellule_sure(v))
            writer.writerow(ligne)
        return reponse


# =========================================================================
#  Comptes du personnel (utilisateurs Django) — liste en Tailwind
# =========================================================================
from django.contrib.auth import get_user_model  # noqa: E402
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin  # noqa: E402

Utilisateur = get_user_model()


class RoleFilter(admin.SimpleListFilter):
    title = 'rôle'
    parameter_name = 'role'

    def lookups(self, request, model_admin):
        return [('admin', 'Administrateurs'), ('scolarite', 'Scolarité'), ('sans_acces', 'Sans accès')]

    def queryset(self, request, qs):
        if self.value() == 'admin':
            return qs.filter(is_superuser=True)
        if self.value() == 'scolarite':
            return qs.filter(is_staff=True, is_superuser=False)
        if self.value() == 'sans_acces':
            return qs.filter(is_staff=False)
        return qs


try:
    admin.site.unregister(Utilisateur)
except NotRegistered:
    pass


@admin.register(Utilisateur)
class CompteAdmin(ListeTailwindMixin, BaseUserAdmin):
    list_filter = [RoleFilter, 'is_active']
    list_per_page = 30
    change_list_template = 'admin/auth/user/change_list.html'

    def preparer_ligne(self, u):
        if u.first_name:
            u.initiales = f'{u.first_name[:1]}{u.last_name[:1]}'.upper()
        else:
            u.initiales = u.get_username()[:2].upper()
        if u.is_superuser:
            u.role, u.role_classes = 'Administrateur', 'bg-istag text-white ring-istag'
        elif u.is_staff:
            u.role, u.role_classes = 'Scolarité', 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        else:
            u.role, u.role_classes = 'Sans accès', 'bg-slate-100 text-slate-600 ring-slate-200'

    def changelist_view(self, request, extra_context=None):
        return super().changelist_view(request, {**(extra_context or {}), 'title': 'Comptes du personnel'})
