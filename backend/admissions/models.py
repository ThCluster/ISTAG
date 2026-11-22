import re
import uuid
from pathlib import Path

from django.conf import settings
from django.db import models, transaction
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils import timezone


def normaliser_telephone(valeur: str) -> str:
    """Garde uniquement les 10 derniers chiffres (format ivoirien), pour comparer
    '+225 07 07 07 07 07' et '0707070707' comme le même numéro."""
    chiffres = re.sub(r'\D', '', valeur or '')
    return chiffres[-10:]


class PreInscription(models.Model):
    class Statut(models.TextChoices):
        RECUE = 'recue', 'En attente de traitement'
        EN_EXAMEN = 'en_examen', "En cours d'examen"
        A_COMPLETER = 'a_completer', 'Dossier à compléter / corriger'
        ADMIS = 'admis', 'Approuvé — admis(e)'
        INSCRIT = 'inscrit', 'Validé — inscrit(e) définitivement'
        REJETEE = 'rejetee', 'Rejetée'

    numero_dossier = models.CharField('N° de dossier', max_length=20, unique=True, editable=False)
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.RECUE, db_index=True)

    # Formation demandée
    niveau = models.CharField('Cycle', max_length=40)
    filiere_id = models.CharField('Identifiant filière', max_length=60)
    filiere_nom = models.CharField('Filière', max_length=200)
    campus_id = models.CharField('Identifiant campus', max_length=60)
    campus_nom = models.CharField('Campus', max_length=200)
    regime = models.CharField('Régime horaire', max_length=40)

    # Identité & contacts
    nom = models.CharField(max_length=100)
    prenoms = models.CharField('Prénoms', max_length=150)
    date_naissance = models.DateField('Date de naissance', null=True, blank=True)
    genre = models.CharField(max_length=20)
    nationalite = models.CharField('Nationalité', max_length=60)
    telephone = models.CharField('Téléphone', max_length=30)
    telephone_normalise = models.CharField(max_length=10, editable=False, db_index=True)
    whatsapp = models.CharField('WhatsApp', max_length=30, blank=True)
    email = models.EmailField(blank=True)
    ville_residence = models.CharField('Ville de résidence', max_length=100, blank=True)

    # Cursus antérieur
    dernier_diplome = models.CharField('Dernier diplôme', max_length=100)
    serie = models.CharField('Série / spécialité', max_length=100, blank=True)
    etablissement_origine = models.CharField("Établissement d'origine", max_length=200)
    annee_obtention = models.CharField("Année d'obtention", max_length=10)
    mention = models.CharField(max_length=50, blank=True)

    # Suivi par la scolarité
    message_candidat = models.TextField(
        'Message au candidat',
        blank=True,
        help_text="Visible par le candidat quand il consulte son dossier en ligne "
                  "(ex : « Votre acte de naissance est illisible, merci de le renvoyer »).",
    )
    notes_internes = models.TextField(
        'Notes internes', blank=True,
        help_text='Visibles uniquement par la scolarité.',
    )
    traite_par = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+', verbose_name='Traité par',
    )
    consentement = models.BooleanField('Consentement données personnelles', default=False)

    date_creation = models.DateTimeField('Reçue le', auto_now_add=True, db_index=True)
    date_mise_a_jour = models.DateTimeField('Mise à jour', auto_now=True)

    class Meta:
        verbose_name = 'Pré-inscription'
        verbose_name_plural = 'Pré-inscriptions'
        ordering = ['-date_creation']

    def __str__(self):
        return f'{self.numero_dossier} — {self.nom_complet}'

    @property
    def nom_complet(self):
        return f'{self.nom.upper()} {self.prenoms}'

    @property
    def initiales(self):
        """Affichées à la place de la photo quand elle manque (ex : « KJ »)."""
        return f'{self.nom[:1]}{self.prenoms[:1]}'.upper()

    def piece(self, type_piece):
        """Pièce d'un type donné (utilise les pièces préchargées si disponibles)."""
        return next((p for p in self.pieces.all() if p.type_piece == type_piece), None)

    @property
    def photo(self):
        return self.piece(PieceJustificative.Type.PHOTO)

    @property
    def diplome_facultatif(self):
        return self.mention.lower().startswith('en cours')

    # --- Décisions de la scolarité -----------------------------------------
    MESSAGE_APPROBATION = (
        "Félicitations, votre dossier a été approuvé ! Présentez-vous à la scolarité du campus "
        "avec ce récépissé et les originaux de vos pièces pour finaliser votre inscription."
    )
    MESSAGE_VALIDATION = (
        "Votre inscription est validée. Bienvenue à l'ISTAG !"
    )

    def peut_approuver(self):
        """Renvoie None si le dossier peut être approuvé, sinon la raison du refus."""
        if self.statut in (self.Statut.ADMIS, self.Statut.INSCRIT):
            return 'Ce dossier est déjà approuvé.'
        if self.statut == self.Statut.REJETEE:
            return 'Ce dossier a été rejeté.'
        pieces = list(self.pieces.all())
        if any(p.statut == PieceJustificative.Statut.NON_CONFORME for p in pieces):
            return ("Impossible d'approuver : au moins une pièce est « Non conforme ». "
                    'Attendez que le candidat la renvoie, ou corrigez son statut.')
        presentes = {p.type_piece for p in pieces}
        obligatoires = {PieceJustificative.Type.ACTE_NAISSANCE, PieceJustificative.Type.PIECE_IDENTITE,
                        PieceJustificative.Type.PHOTO}
        if not self.mention.lower().startswith('en cours'):
            obligatoires.add(PieceJustificative.Type.DIPLOME)
        manquantes = obligatoires - presentes
        if manquantes:
            noms = ', '.join(sorted(PieceJustificative.Type(t).label for t in manquantes))
            return f"Impossible d'approuver : pièce(s) manquante(s) — {noms}."
        return None

    def approuver(self, utilisateur):
        """Admet le candidat : les pièces encore « à vérifier » sont considérées conformes."""
        with transaction.atomic():
            self.pieces.filter(statut=PieceJustificative.Statut.EN_ATTENTE).update(
                statut=PieceJustificative.Statut.CONFORME, commentaire='')
            self.statut = self.Statut.ADMIS
            self.traite_par = utilisateur
            if not self.message_candidat.strip():
                self.message_candidat = self.MESSAGE_APPROBATION
            self.save()

    def peut_valider(self):
        if self.statut == self.Statut.INSCRIT:
            return 'Cette inscription est déjà validée.'
        if self.statut != self.Statut.ADMIS:
            return "Le dossier doit d'abord être approuvé."
        return None

    def valider(self, utilisateur):
        """Inscription définitive (le candidat est passé à la scolarité)."""
        self.statut = self.Statut.INSCRIT
        self.traite_par = utilisateur
        if not self.message_candidat.strip() or self.message_candidat == self.MESSAGE_APPROBATION:
            self.message_candidat = self.MESSAGE_VALIDATION
        self.save()

    def peut_rejeter(self):
        if self.statut in (self.Statut.REJETEE, self.Statut.INSCRIT):
            return 'Ce dossier est déjà clôturé.'
        return None

    def rejeter(self, utilisateur, motif):
        self.statut = self.Statut.REJETEE
        self.traite_par = utilisateur
        self.message_candidat = motif
        self.save()

    def peut_rouvrir(self):
        if self.statut not in (self.Statut.ADMIS, self.Statut.REJETEE):
            return "Seul un dossier approuvé ou rejeté peut être rouvert."
        return None

    def rouvrir(self, utilisateur):
        """Annule une approbation ou un rejet (erreur de manipulation)."""
        self.statut = self.Statut.EN_EXAMEN
        self.traite_par = utilisateur
        if self.message_candidat == self.MESSAGE_APPROBATION:
            self.message_candidat = ''
        self.save()

    def verifier_piece(self, piece, conforme, motif, utilisateur):
        """Marque une pièce conforme / non conforme et met à jour le statut du dossier."""
        with transaction.atomic():
            piece.statut = (PieceJustificative.Statut.CONFORME if conforme
                            else PieceJustificative.Statut.NON_CONFORME)
            piece.commentaire = '' if conforme else motif
            piece.save(update_fields=['statut', 'commentaire'])

            self.traite_par = utilisateur
            if self.statut in (self.Statut.RECUE, self.Statut.EN_EXAMEN, self.Statut.A_COMPLETER):
                reste_non_conforme = self.pieces.filter(statut=PieceJustificative.Statut.NON_CONFORME).exists()
                # Une pièce refusée → le candidat doit agir ; sinon le dossier est en cours d'examen.
                self.statut = self.Statut.A_COMPLETER if reste_non_conforme else self.Statut.EN_EXAMEN
            self.save()

    def save(self, *args, **kwargs):
        self.telephone_normalise = normaliser_telephone(self.telephone)
        if self.pk:
            return super().save(*args, **kwargs)
        # Le numéro dépend de l'id : on enregistre d'abord avec un numéro
        # temporaire unique, puis on attribue ISTAG-<année>-<id sur 4 chiffres>.
        with transaction.atomic():
            self.numero_dossier = f'TMP-{uuid.uuid4().hex[:12]}'
            super().save(*args, **kwargs)
            self.numero_dossier = f'ISTAG-{timezone.now().year}-{self.pk:04d}'
            super().save(update_fields=['numero_dossier'])


def chemin_piece(instance, filename):
    ext = Path(filename).suffix.lower()
    return f'pieces/{instance.preinscription_id}/{instance.type_piece}-{uuid.uuid4().hex[:8]}{ext}'


class PieceJustificative(models.Model):
    class Type(models.TextChoices):
        ACTE_NAISSANCE = 'acte_naissance', "Extrait d'acte de naissance"
        DIPLOME = 'diplome', 'Diplôme / attestation du dernier diplôme'
        PIECE_IDENTITE = 'piece_identite', "CNI ou passeport"
        PHOTO = 'photo', "Photo d'identité"

    class Statut(models.TextChoices):
        EN_ATTENTE = 'en_attente', 'À vérifier'
        CONFORME = 'conforme', 'Conforme'
        NON_CONFORME = 'non_conforme', 'Non conforme — à renvoyer'

    preinscription = models.ForeignKey(PreInscription, on_delete=models.CASCADE, related_name='pieces')
    type_piece = models.CharField('Pièce', max_length=30, choices=Type.choices)
    fichier = models.FileField(upload_to=chemin_piece)
    nom_original = models.CharField('Nom du fichier', max_length=255, blank=True)
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.EN_ATTENTE)
    commentaire = models.CharField(
        'Commentaire pour le candidat', max_length=255, blank=True,
        help_text='Ex : « Photo floue », « Document expiré ». Visible par le candidat.',
    )
    date_envoi = models.DateTimeField('Envoyée le', auto_now_add=True)

    class Meta:
        verbose_name = 'Pièce justificative'
        verbose_name_plural = 'Pièces justificatives'
        ordering = ['type_piece']
        constraints = [
            models.UniqueConstraint(fields=['preinscription', 'type_piece'], name='une_piece_par_type'),
        ]

    def __str__(self):
        return self.get_type_piece_display()

    @property
    def est_image(self):
        return Path(self.fichier.name).suffix.lower() in ('.jpg', '.jpeg', '.png')


@receiver(post_delete, sender=PieceJustificative)
def supprimer_fichier_piece(sender, instance, **kwargs):
    """Quand une pièce (ou tout le dossier) est supprimée, on efface aussi le fichier."""
    if instance.fichier:
        instance.fichier.delete(save=False)
