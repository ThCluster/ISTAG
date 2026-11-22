from pathlib import Path

from django.conf import settings
from django.db import transaction
from rest_framework import serializers

from .models import PieceJustificative, PreInscription, normaliser_telephone

EXTENSIONS_AUTORISEES = {'.pdf', '.jpg', '.jpeg', '.png'}

# Signatures binaires : on vérifie le vrai contenu, pas seulement l'extension.
SIGNATURES = {
    '.pdf': [b'%PDF'],
    '.jpg': [b'\xff\xd8\xff'],
    '.jpeg': [b'\xff\xd8\xff'],
    '.png': [b'\x89PNG\r\n\x1a\n'],
}

TYPES = PieceJustificative.Type


def valider_fichier(fichier):
    ext = Path(fichier.name).suffix.lower()
    if ext not in EXTENSIONS_AUTORISEES:
        raise serializers.ValidationError('Format non accepté. Envoyez un PDF, JPG ou PNG.')
    taille_max = settings.ADMISSIONS_TAILLE_MAX_PIECE
    if fichier.size > taille_max:
        raise serializers.ValidationError(
            f'Fichier trop volumineux (maximum {taille_max // (1024 * 1024)} Mo).'
        )
    debut = fichier.read(8)
    fichier.seek(0)
    if not any(debut.startswith(sig) for sig in SIGNATURES[ext]):
        raise serializers.ValidationError("Le fichier est corrompu ou n'est pas du format annoncé.")
    return fichier


class PreInscriptionCreateSerializer(serializers.ModelSerializer):
    """Reçoit le formulaire du site (multipart/form-data) avec les pièces jointes."""

    piece_acte_naissance = serializers.FileField(write_only=True, validators=[valider_fichier])
    piece_diplome = serializers.FileField(write_only=True, required=False, validators=[valider_fichier])
    piece_identite = serializers.FileField(write_only=True, validators=[valider_fichier])
    piece_photo = serializers.FileField(write_only=True, validators=[valider_fichier])

    # Champ piège anti-robots : invisible pour les humains, doit rester vide.
    site_web = serializers.CharField(write_only=True, required=False, allow_blank=True)

    CHAMPS_PIECES = {
        'piece_acte_naissance': TYPES.ACTE_NAISSANCE,
        'piece_diplome': TYPES.DIPLOME,
        'piece_identite': TYPES.PIECE_IDENTITE,
        'piece_photo': TYPES.PHOTO,
    }

    class Meta:
        model = PreInscription
        fields = [
            'numero_dossier', 'date_creation',
            'niveau', 'filiere_id', 'filiere_nom', 'campus_id', 'campus_nom', 'regime',
            'nom', 'prenoms', 'date_naissance', 'genre', 'nationalite',
            'telephone', 'whatsapp', 'email', 'ville_residence',
            'dernier_diplome', 'serie', 'etablissement_origine', 'annee_obtention', 'mention',
            'consentement',
            'piece_acte_naissance', 'piece_diplome', 'piece_identite', 'piece_photo',
            'site_web',
        ]
        read_only_fields = ['numero_dossier', 'date_creation']

    def validate_telephone(self, valeur):
        if len(normaliser_telephone(valeur)) < 8:
            raise serializers.ValidationError('Numéro de téléphone invalide.')
        return valeur.strip()

    def validate_consentement(self, valeur):
        if not valeur:
            raise serializers.ValidationError(
                'Vous devez accepter le traitement de vos données pour envoyer le dossier.'
            )
        return valeur

    def validate(self, data):
        if data.get('site_web'):
            raise serializers.ValidationError('Envoi refusé.')
        en_cours = data.get('mention', '').lower().startswith('en cours')
        if not data.get('piece_diplome') and not en_cours:
            raise serializers.ValidationError({
                'piece_diplome': "La copie du dernier diplôme est obligatoire "
                                 "(sauf si le diplôme est en cours d'obtention).",
            })
        return data

    def create(self, data):
        data.pop('site_web', None)
        fichiers = {
            type_piece: data.pop(champ)
            for champ, type_piece in self.CHAMPS_PIECES.items()
            if data.get(champ)
        }
        for champ in self.CHAMPS_PIECES:
            data.pop(champ, None)

        with transaction.atomic():
            dossier = PreInscription.objects.create(**data)
            for type_piece, fichier in fichiers.items():
                PieceJustificative.objects.create(
                    preinscription=dossier,
                    type_piece=type_piece,
                    fichier=fichier,
                    nom_original=fichier.name[:255],
                )
        return dossier


class PieceSuiviSerializer(serializers.ModelSerializer):
    type_label = serializers.CharField(source='get_type_piece_display')
    statut_label = serializers.CharField(source='get_statut_display')

    class Meta:
        model = PieceJustificative
        fields = ['type_piece', 'type_label', 'statut', 'statut_label', 'commentaire', 'date_envoi']


class SuiviSerializer(serializers.ModelSerializer):
    """Ce que le candidat voit en consultant son dossier : pas de notes internes."""

    statut_label = serializers.CharField(source='get_statut_display')
    pieces = PieceSuiviSerializer(many=True)

    class Meta:
        model = PreInscription
        fields = [
            'numero_dossier', 'statut', 'statut_label', 'message_candidat',
            'nom', 'prenoms', 'niveau', 'filiere_nom', 'campus_nom', 'regime',
            'date_creation', 'date_mise_a_jour', 'pieces',
        ]


class IdentificationSerializer(serializers.Serializer):
    numero = serializers.CharField(max_length=20)
    telephone = serializers.CharField(max_length=30)


class RemplacementPieceSerializer(IdentificationSerializer):
    type_piece = serializers.ChoiceField(choices=TYPES.choices)
    fichier = serializers.FileField(validators=[valider_fichier])
