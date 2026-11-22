"""Éléments partagés par les pages Tailwind du back office (couleurs, listes)."""
from django.contrib.admin.views.main import PAGE_VAR, SEARCH_VAR

# Classes Tailwind par couleur. Elles sont écrites en entier pour que Tailwind
# les trouve en analysant ce fichier (voir backend/tailwind/theme.css).
TONS = {
    'jaune': {'icone': 'bg-amber-100 text-amber-700', 'barre': 'bg-amber-400',
              'badge': 'bg-amber-50 text-amber-700 ring-amber-200'},
    'orange': {'icone': 'bg-orange-100 text-orange-700', 'barre': 'bg-orange-400',
               'badge': 'bg-orange-50 text-orange-700 ring-orange-200'},
    'ambre': {'icone': 'bg-yellow-100 text-yellow-700', 'barre': 'bg-yellow-400',
              'badge': 'bg-yellow-50 text-yellow-800 ring-yellow-200'},
    'emeraude': {'icone': 'bg-emerald-100 text-emerald-700', 'barre': 'bg-emerald-500',
                 'badge': 'bg-emerald-50 text-emerald-700 ring-emerald-200'},
    'vert': {'icone': 'bg-istag/10 text-istag', 'barre': 'bg-istag',
             'badge': 'bg-istag text-white ring-istag'},
    'rouge': {'icone': 'bg-rose-100 text-rose-700', 'barre': 'bg-rose-400',
              'badge': 'bg-rose-50 text-rose-700 ring-rose-200'},
    'gris': {'icone': 'bg-slate-100 text-slate-600', 'barre': 'bg-slate-300',
             'badge': 'bg-slate-100 text-slate-600 ring-slate-200'},
}

TON_DU_STATUT = {
    'recue': 'jaune', 'en_examen': 'orange', 'a_completer': 'ambre',
    'admis': 'emeraude', 'inscrit': 'vert', 'rejetee': 'rouge',
}

# Pastilles des pièces dans la liste des dossiers
PASTILLE_PIECE = {
    'en_attente': 'bg-amber-50 text-amber-700 ring-amber-300',
    'conforme': 'bg-emerald-50 text-emerald-700 ring-emerald-300',
    'non_conforme': 'bg-rose-50 text-rose-700 ring-rose-300',
    'manquante': 'bg-white text-slate-300 ring-slate-200',
}


def badge_statut(statut):
    return TONS[TON_DU_STATUT.get(statut, 'gris')]['badge']


def _pagination(cl):
    total, courante = cl.paginator.num_pages, cl.page_num
    if total <= 1:
        return None
    numeros = sorted({1, total, *range(max(1, courante - 2), min(total, courante + 2) + 1)})
    pages, precedent = [], 0
    for n in numeros:
        if n - precedent > 1:
            pages.append({'ellipse': True})
        pages.append({'num': n, 'url': cl.get_query_string({PAGE_VAR: n}), 'actif': n == courante})
        precedent = n
    return {
        'pages': pages,
        'precedente': cl.get_query_string({PAGE_VAR: courante - 1}) if courante > 1 else None,
        'suivante': cl.get_query_string({PAGE_VAR: courante + 1}) if courante < total else None,
    }


class ListeTailwindMixin:
    """Prépare ce dont un template de liste Tailwind a besoin (filtres, pages,
    actions), à partir de la ChangeList de Django — qui garde toute la logique
    (permissions, recherche, actions groupées)."""

    def preparer_ligne(self, obj):
        """À surcharger : ajoute des attributs d'affichage à chaque ligne."""

    def changelist_view(self, request, extra_context=None):
        reponse = super().changelist_view(request, extra_context)
        contexte = getattr(reponse, 'context_data', None)
        if not contexte or 'cl' not in contexte:
            return reponse  # redirection, export CSV, etc.

        cl = contexte['cl']
        cl.result_list = list(cl.result_list)
        for obj in cl.result_list:
            self.preparer_ligne(obj)

        parametres_conserves = []
        for cle, valeur in cl.params.items():
            if cle in (SEARCH_VAR, PAGE_VAR):
                continue
            for v in (valeur if isinstance(valeur, list) else [valeur]):
                parametres_conserves.append((cle, v))

        contexte.update({
            'filtres': [{'titre': spec.title, 'choix': list(spec.choices(cl))} for spec in cl.filter_specs],
            'pagination': _pagination(cl),
            'actions_choix': [c for c in self.get_action_choices(request) if c[0]],
            'recherche': cl.query,
            'parametres_conserves': parametres_conserves,
            'filtre_actif': any(k not in (SEARCH_VAR, PAGE_VAR) for k in cl.params),
        })
        return reponse
