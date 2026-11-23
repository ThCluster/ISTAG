"""
Paramètres Django du backend ISTAG (pré-inscriptions).

Les valeurs sensibles se règlent par variables d'environnement :
  DJANGO_SECRET_KEY, DJANGO_DEBUG, DJANGO_ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS,
  CORS_ALLOWED_ORIGINS, FRONTEND_URL,
  DATABASE_URL (PostgreSQL en production ; SQLite local si absent),
  BLOB_READ_WRITE_TOKEN / BLOB_STORE_ID (store Vercel Blob privé pour les pièces
  justificatives, ajoutés par Vercel ; dossier media/ local si absents).
"""

import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default):
    return [v.strip() for v in os.environ.get(name, default).split(',') if v.strip()]


# --- Sécurité -------------------------------------------------------------
SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-dev-only-a-remplacer-en-production',
)
DEBUG = os.environ.get('DJANGO_DEBUG', 'True').lower() in ('1', 'true', 'yes')
ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
CSRF_TRUSTED_ORIGINS = env_list('CSRF_TRUSTED_ORIGINS', '')

# Vercel fournit automatiquement les adresses du déploiement (*.vercel.app).
for variable in ('VERCEL_URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_BRANCH_URL'):
    hote = os.environ.get(variable)
    if hote:
        ALLOWED_HOSTS.append(hote)
        CSRF_TRUSTED_ORIGINS.append(f'https://{hote}')

# Derrière le proxy HTTPS de Vercel (nécessaire pour la connexion à l'admin).
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 3600

# En local : base SQLite et pièces dans ce dossier. Sur Vercel le disque n'est
# pas conservé : la base est sur PostgreSQL et les pièces sur Vercel Blob.
DATA_DIR = Path(os.environ.get('DATA_DIR', BASE_DIR))

# Adresse du site public (lien « Voir le site » du dashboard)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Origines du frontend autorisées à appeler l'API
CORS_ALLOWED_ORIGINS = env_list(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000',
)


# --- Applications ---------------------------------------------------------
INSTALLED_APPS = [
    'config.apps.IstagAdminConfig',  # admin Django avec le thème ISTAG
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'admissions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # sert le CSS / les images de l'admin
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# --- Base de données ------------------------------------------------------
# DATABASE_URL (fournie par Neon / Vercel) → PostgreSQL ; sinon SQLite local.
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{DATA_DIR / 'db.sqlite3'}",
        conn_max_age=0,  # fonctions serverless : pas de connexion gardée ouverte
        conn_health_checks=True,
    )
}


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# --- Langue & fuseau horaire ----------------------------------------------
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Abidjan'
USE_I18N = True
USE_TZ = True


# --- Fichiers statiques & documents envoyés -------------------------------
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
# Sur Vercel, collectstatic n'est pas lancé : WhiteNoise lit directement les
# fichiers statiques des applications (admin Django, admissions/static).
WHITENOISE_USE_FINDERS = True

# Les pièces justificatives ne sont JAMAIS servies publiquement : elles ne sont
# accessibles que par le personnel connecté à l'admin (voir
# admissions.views.piece_fichier). En production elles vont dans un store
# Vercel Blob privé, en local dans le dossier media/.
MEDIA_ROOT = DATA_DIR / 'media'
if os.environ.get('BLOB_STORE_ID') or os.environ.get('BLOB_READ_WRITE_TOKEN'):
    STOCKAGE_PIECES = {'BACKEND': 'config.stockage.VercelBlobPriveStorage'}
elif os.environ.get('VERCEL'):
    # Sur Vercel le disque est effacé : sans store Blob, les pièces seraient perdues.
    raise ImproperlyConfigured(
        'Aucun store Vercel Blob relié au projet (BLOB_READ_WRITE_TOKEN manquant).'
    )
else:
    STOCKAGE_PIECES = {'BACKEND': 'django.core.files.storage.FileSystemStorage'}

STORAGES = {
    'default': STOCKAGE_PIECES,
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage'},
}

# Taille maximale d'une pièce justificative (en octets). Vercel refuse les
# requêtes de plus de 4,5 Mo : le site compresse les photos avant l'envoi.
ADMISSIONS_TAILLE_MAX_PIECE = 4 * 1024 * 1024  # 4 Mo


# --- API ------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_THROTTLE_RATES': {
        'preinscription': '10/hour',
        'suivi': '60/hour',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
