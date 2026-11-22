from datetime import timedelta

from django.conf import settings
from django.contrib import admin
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.urls import reverse
from django.utils import timezone

from admissions.ui import TONS, badge_statut

JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

class IstagAdminSite(admin.AdminSite):
    site_header = 'ISTAG · Scolarité'
    site_title = 'ISTAG Scolarité'
    index_title = 'Tableau de bord'
    enable_nav_sidebar = False  # menu simple en haut de page à la place

    @property
    def site_url(self):
        return settings.FRONTEND_URL

    def index(self, request, extra_context=None):
        from admissions.models import PieceJustificative, PreInscription

        Statut = PreInscription.Statut
        qs = PreInscription.objects.all()
        liste = reverse('admin:admissions_preinscription_changelist')
        comptes = dict(qs.values_list('statut').annotate(n=Count('id')).values_list('statut', 'n'))
        total = sum(comptes.values())

        def carte(statut, titre, conseil, ton, icone):
            return {
                'statut': statut, 'titre': titre, 'conseil': conseil, 'ton': TONS[ton], 'icone': icone,
                'nombre': comptes.get(statut, 0),
                'part': round(100 * comptes.get(statut, 0) / total) if total else 0,
                'url': f'{liste}?statut__exact={statut}',
            }

        cartes = [
            carte(Statut.RECUE, 'Nouveaux dossiers', 'À ouvrir et vérifier', 'jaune', 'inbox'),
            carte(Statut.EN_EXAMEN, 'En cours', 'Pièces à terminer de vérifier', 'orange', 'loupe'),
            carte(Statut.A_COMPLETER, 'En attente du candidat', 'Il doit renvoyer une pièce', 'ambre', 'horloge'),
            carte(Statut.ADMIS, 'Approuvés', 'À valider au guichet', 'emeraude', 'check'),
            carte(Statut.INSCRIT, 'Inscrits', 'Dossiers terminés', 'vert', 'diplome'),
            carte(Statut.REJETEE, 'Rejetés', 'Dossiers refusés', 'rouge', 'croix'),
        ]

        # Dépôts des 14 derniers jours (pour le mini-graphique)
        aujourd_hui = timezone.localdate()
        debut = aujourd_hui - timedelta(days=13)
        par_date = dict(
            qs.filter(date_creation__date__gte=debut)
            .annotate(jour=TruncDate('date_creation', tzinfo=timezone.get_current_timezone()))
            .values('jour').annotate(n=Count('id')).values_list('jour', 'n')
        )
        jours = [debut + timedelta(days=i) for i in range(14)]
        max_jour = max([par_date.get(j, 0) for j in jours] + [1])
        par_jour = [{
            'label': JOURS[j.weekday()], 'date': j, 'n': par_date.get(j, 0),
            'hauteur': max(4, round(100 * par_date.get(j, 0) / max_jour)),
            'aujourdhui': j == aujourd_hui,
        } for j in jours]

        # Filières les plus demandées
        filieres = list(qs.values('filiere_nom').annotate(n=Count('id')).order_by('-n')[:5])
        max_filiere = filieres[0]['n'] if filieres else 1
        for f in filieres:
            f['largeur'] = round(100 * f['n'] / max_filiere)

        a_traiter = (qs.filter(statut__in=[Statut.RECUE, Statut.EN_EXAMEN])
                     .prefetch_related('pieces').order_by('date_creation')[:6])
        activite = (qs.exclude(traite_par=None).select_related('traite_par')
                    .order_by('-date_mise_a_jour')[:5])

        a_traiter, activite = list(a_traiter), list(activite)
        for d in a_traiter + activite:
            d.badge_classes = badge_statut(d.statut)

        valides = comptes.get(Statut.ADMIS, 0) + comptes.get(Statut.INSCRIT, 0)
        extra_context = {
            **(extra_context or {}),
            'cartes': cartes,
            'a_traiter': a_traiter,
            'activite': activite,
            'nb_a_traiter': comptes.get(Statut.RECUE, 0) + comptes.get(Statut.EN_EXAMEN, 0),
            'total_dossiers': total,
            'taux_approbation': round(100 * valides / total) if total else 0,
            'pieces_a_verifier': PieceJustificative.objects.filter(
                statut=PieceJustificative.Statut.EN_ATTENTE).count(),
            'recus_aujourdhui': par_date.get(aujourd_hui, 0),
            'recus_14j': sum(par_date.get(j, 0) for j in jours),
            'par_jour': par_jour,
            'filieres': filieres,
            'aujourdhui': aujourd_hui,
            'url_liste': liste,
            'url_nouveaux': f'{liste}?statut__exact={Statut.RECUE}',
        }
        return super().index(request, extra_context)
