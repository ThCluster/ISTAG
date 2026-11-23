"""Stockage des pièces justificatives dans un store Vercel Blob **privé**.

Les fichiers ne sont jamais accessibles par une adresse publique : Django les lit
avec les identifiants du projet (OIDC fourni par Vercel, ou BLOB_READ_WRITE_TOKEN
en local) et ne les affiche qu'au personnel connecté (admissions.views.piece_fichier).
"""

import mimetypes

from django.core.files.base import ContentFile
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from vercel.blob import BlobNotFoundError
from vercel.blob import sync as blob


@deconstructible
class VercelBlobPriveStorage(Storage):
    def _open(self, name, mode='rb'):
        try:
            resultat = blob.get_blob(name, access='private')
        except BlobNotFoundError:
            raise FileNotFoundError(name)
        return ContentFile(resultat.body, name=name)

    def _save(self, name, content):
        if hasattr(content, 'seek'):
            content.seek(0)
        donnees = content.read()
        # Type déduit de l'extension (déjà vérifiée), pas de ce qu'annonce le navigateur.
        type_mime = mimetypes.guess_type(name)[0]
        resultat = blob.put_blob(
            name, donnees, access='private',
            content_type=type_mime or 'application/octet-stream',
        )
        return resultat.pathname

    def delete(self, name):
        if name:
            blob.delete_blob(name)

    def exists(self, name):
        try:
            blob.head_blob(name)
        except BlobNotFoundError:
            return False
        return True

    def size(self, name):
        return blob.head_blob(name).size

    def url(self, name):
        raise NotImplementedError('Pièces privées : passer par la vue piece_fichier.')
