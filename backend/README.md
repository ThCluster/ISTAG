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

1. Le candidat remplit le formulaire et joint ses pièces (PDF / JPG / PNG, 4 Mo max chacune, 4 Mo au total — les photos sont compressées par le site avant l'envoi).
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
  `DATABASE_URL` (PostgreSQL) et un store Vercel Blob privé (stockage des pièces).

## Tests

```bash
python manage.py test admissions
```

## Déploiement sur Vercel (domaine istag.ci)

Vercel ne conserve aucun fichier sur le serveur. La base de données est donc sur
**PostgreSQL (Neon)** et les pièces justificatives dans un store **Vercel Blob privé**.
Vercel refuse aussi les requêtes de plus de 4,5 Mo : c'est pourquoi les pièces
d'un dossier sont limitées à 4 Mo au total (les photos sont compressées par le site).

| Adresse | Projet Vercel | Root Directory |
|---|---|---|
| `https://istag.ci` (+ `www.istag.ci`) | frontend | `frontend` |
| `https://api.istag.ci` (API + dashboard `/admin/`) | backend | `backend` |

### 1. Projet Vercel « backend »

*Add New → Project* → importer le dépôt GitHub, **Root Directory : `backend`**
(le fichier `backend/vercel.json` configure le reste).

Base de données : onglet **Storage → Create Database → Neon (Postgres)** et la relier au projet :
la variable `DATABASE_URL` est ajoutée automatiquement.

Pièces justificatives : **Storage → Create Database → Blob**, accès **Private**
(impossible à changer ensuite), puis le relier au projet : `BLOB_READ_WRITE_TOKEN`
est ajoutée automatiquement.

Variables d'environnement (*Settings → Environment Variables*) :

| Variable | Valeur |
|---|---|
| `DJANGO_SECRET_KEY` | une longue chaîne aléatoire |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `api.istag.ci` |
| `CSRF_TRUSTED_ORIGINS` | `https://api.istag.ci` |
| `CORS_ALLOWED_ORIGINS` | `https://istag.ci,https://www.istag.ci` |
| `FRONTEND_URL` | `https://istag.ci` |

Créer les tables et le compte admin **depuis ton PC** (une fois, puis à chaque nouvelle migration),
avec l'adresse Neon copiée depuis Vercel :

```powershell
cd backend
venv\Scripts\activate
$env:DATABASE_URL = "postgresql://...neon.tech/neondb?sslmode=require"
python manage.py migrate
python manage.py createsuperuser
Remove-Item Env:DATABASE_URL
```

*Settings → Domains* → ajouter `api.istag.ci`.

### 2. Projet Vercel « frontend »

*Add New → Project* → même dépôt, **Root Directory : `frontend`** (Vite est détecté).
Variable : `VITE_API_URL` = `https://api.istag.ci` (puis redéployer si ajoutée après coup).
*Settings → Domains* → ajouter `istag.ci` et `www.istag.ci` (redirection de `www` vers `istag.ci`).

### 3. DNS chez TPCloud

Dans l'espace client TPCloud → *Domaines → istag.ci → Gestion DNS / Zone DNS* :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` (istag.ci) | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `api` | `cname.vercel-dns.com` |

Supprimer les anciens enregistrements A / CNAME sur `@`, `www` et `api` (page de parking TPCloud).
Si Vercel affiche d'autres valeurs dans *Settings → Domains*, utiliser celles de Vercel.
La propagation prend de quelques minutes à quelques heures ; le certificat HTTPS est créé automatiquement.
