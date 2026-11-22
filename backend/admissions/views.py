import mimetypes

from django.contrib.admin.views.decorators import staff_member_required
from django.db import transaction
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import PieceJustificative, PreInscription, normaliser_telephone
from .serializers import (
    IdentificationSerializer,
    PreInscriptionCreateSerializer,
    RemplacementPieceSerializer,
    SuiviSerializer,
)

DOSSIER_INTROUVABLE = (
    'Aucun dossier ne correspond à ce numéro et ce téléphone. '
    'Vérifiez les informations de votre récépissé.'
)


def trouver_dossier(numero, telephone):
    """Le candidat doit fournir le numéro ET le téléphone : un numéro seul
    (facile à deviner) ne suffit pas pour voir un dossier."""
    tel = normaliser_telephone(telephone)
    if not tel:
        return None
    return (
        PreInscription.objects.prefetch_related('pieces')
        .filter(numero_dossier__iexact=numero.strip(), telephone_normalise=tel)
        .first()
    )


class PreInscriptionCreateView(generics.CreateAPIView):
    """POST /api/preinscriptions/ — dépôt d'une pré-inscription depuis le site."""

    serializer_class = PreInscriptionCreateSerializer
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'preinscription'


class SuiviDossierView(APIView):
    """POST /api/preinscriptions/suivi/ {numero, telephone} — statut du dossier."""

    parser_classes = [JSONParser, FormParser, MultiPartParser]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'suivi'

    def post(self, request):
        ident = IdentificationSerializer(data=request.data)
        ident.is_valid(raise_exception=True)
        dossier = trouver_dossier(ident.validated_data['numero'], ident.validated_data['telephone'])
        if dossier is None:
            return Response({'detail': DOSSIER_INTROUVABLE}, status=status.HTTP_404_NOT_FOUND)
        return Response(SuiviSerializer(dossier).data)


class RemplacementPieceView(APIView):
    """POST /api/preinscriptions/suivi/pieces/ — le candidat renvoie une pièce
    signalée non conforme (ou ajoute une pièce manquante)."""

    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'preinscription'

    def post(self, request):
        ser = RemplacementPieceSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        dossier = trouver_dossier(data['numero'], data['telephone'])
        if dossier is None:
            return Response({'detail': DOSSIER_INTROUVABLE}, status=status.HTTP_404_NOT_FOUND)
        if dossier.statut in (PreInscription.Statut.INSCRIT, PreInscription.Statut.REJETEE):
            return Response(
                {'detail': "Ce dossier est clôturé, il n'accepte plus de documents."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        piece = dossier.pieces.filter(type_piece=data['type_piece']).first()
        if piece and piece.statut == PieceJustificative.Statut.CONFORME:
            return Response(
                {'detail': 'Cette pièce a déjà été validée par la scolarité.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        fichier = data['fichier']
        with transaction.atomic():
            if piece:
                ancien = piece.fichier.name
                piece.fichier = fichier
                piece.nom_original = fichier.name[:255]
                piece.statut = PieceJustificative.Statut.EN_ATTENTE
                piece.commentaire = ''
                piece.save()
                stockage = piece.fichier.storage
                transaction.on_commit(lambda: stockage.delete(ancien))
            else:
                PieceJustificative.objects.create(
                    preinscription=dossier, type_piece=data['type_piece'],
                    fichier=fichier, nom_original=fichier.name[:255],
                )
            # Le dossier revient dans la file d'examen de la scolarité.
            if dossier.statut == PreInscription.Statut.A_COMPLETER:
                dossier.statut = PreInscription.Statut.EN_EXAMEN
                dossier.save(update_fields=['statut', 'date_mise_a_jour'])

        dossier = trouver_dossier(data['numero'], data['telephone'])
        return Response(SuiviSerializer(dossier).data)


@staff_member_required
def piece_fichier(request, pk):
    """Affiche une pièce justificative — réservé au personnel connecté à l'admin."""
    piece = get_object_or_404(PieceJustificative, pk=pk)
    try:
        fh = piece.fichier.open('rb')
    except FileNotFoundError:
        raise Http404('Fichier introuvable sur le serveur.')
    type_mime = mimetypes.guess_type(piece.fichier.name)[0] or 'application/octet-stream'
    nom = f'{piece.preinscription.numero_dossier}-{piece.type_piece}{piece.fichier.name[piece.fichier.name.rfind("."):]}'
    reponse = FileResponse(fh, content_type=type_mime, filename=nom)
    reponse['Content-Disposition'] = f'inline; filename="{nom}"'
    reponse['Cache-Control'] = 'private, no-store'
    return reponse
