from django.urls import path

from . import views

urlpatterns = [
    path('preinscriptions/', views.PreInscriptionCreateView.as_view(), name='preinscription-create'),
    path('preinscriptions/suivi/', views.SuiviDossierView.as_view(), name='preinscription-suivi'),
    path('preinscriptions/suivi/pieces/', views.RemplacementPieceView.as_view(), name='preinscription-piece'),
]
