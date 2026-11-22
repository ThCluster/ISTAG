# Backend ISTAG — Pré-inscriptions (Django REST Framework)

## Installation (première fois)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows  (Linux/Mac : source venv/bin/activate)
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # compte de la scolarité
```

## Lancer le serveur

```bash
python manage.py runserver
```

- API : http://localhost:8000/api/
- Dashboard scolarité : http://localhost:8000/admin/

Le frontend (`frontend/`, port 3000) appelle l'API via `VITE_API_URL` (par défaut `http://localhost:8000`).

## Comptes de la scolarité

Pour un agent qui n'est pas administrateur : dans l'admin, *Utilisateurs → Ajouter*,
cocher **Statut équipe**, puis lui donner les permissions « Pré-inscription » (voir / modifier)
et « Pièce justificative » (voir / modifier).

## Fonctionnement

1. Le candidat remplit le formulaire et joint ses pièces (PDF / JPG / PNG, 5 Mo max chacune).
2. Le serveur crée le dossier `ISTAG-<année>-<n°>` au statut **Reçue**.
3. La scolarité ouvre le dossier dans l'admin, vérifie chaque pièce (Conforme / Non conforme + commentaire),
   et écrit si besoin un **message au candidat**. Elle peut l'appeler ou lui écrire sur WhatsApp depuis la fiche.
4. Le candidat consulte son dossier en ligne (numéro + téléphone), voit le message et les pièces à corriger,
   et peut renvoyer une pièce non conforme. Le dossier revient alors en **En cours d'examen**.

Statuts : Reçue → En cours d'examen → (À compléter) → Admis(e) → Inscrit(e) · Rejetée

## API

| Méthode | URL | Description |
|---|---|---|
| POST (multipart) | `/api/preinscriptions/` | Dépôt d'un dossier + pièces `piece_acte_naissance`, `piece_diplome`, `piece_identite`, `piece_photo` |
| POST (JSON) | `/api/preinscriptions/suivi/` | `{numero, telephone}` → statut, message et état des pièces |
| POST (multipart) | `/api/preinscriptions/suivi/pieces/` | `numero, telephone, type_piece, fichier` → renvoi d'une pièce |

## Sécurité

- Les pièces sont dans `media/`, **jamais servies publiquement** : seul le personnel connecté à l'admin peut les ouvrir.
- Limite d'envois par IP (10 dépôts/heure, 60 consultations/heure), champ piège anti-robots, vérification du vrai format des fichiers.
- En production : définir `FRONTEND_URL`, `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`,
  et sauvegarder régulièrement `db.sqlite3` **et** le dossier `media/`.

## Tests

```bash
python manage.py test admissions
```

## Déploiement sur Render

Deux services, un par dossier du dépôt.

### 1. Backend (Web Service)

| Réglage | Valeur |
|---|---|
| Root Directory | `backend` |
| Runtime | Python |
| Build Command | `./build.sh` |
| Start Command | `./start.sh` |
| Disque persistant | monté sur `/var/data` (indispensable : base SQLite + documents) |

Variables d'environnement :

| Variable | Exemple |
|---|---|
| `DJANGO_SECRET_KEY` | une longue chaîne aléatoire |
| `DJANGO_DEBUG` | `False` |
| `DATA_DIR` | `/var/data` |
| `FRONTEND_URL` | `https://istag.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://istag.onrender.com` |
| `DJANGO_SUPERUSER_USERNAME` / `DJANGO_SUPERUSER_PASSWORD` | compte admin créé au 1er démarrage |

### 2. Frontend (Static Site)

| Réglage | Valeur |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Variable `VITE_API_URL` | adresse du backend, ex. `https://istag-api.onrender.com` |
