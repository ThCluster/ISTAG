#!/usr/bin/env bash
# Démarrage Render : met à jour la base, crée le compte admin s'il n'existe pas, lance le serveur.
set -o errexit

mkdir -p "${DATA_DIR:-.}"
python manage.py migrate --no-input
# Crée le superutilisateur à partir de DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_PASSWORD
# (sans erreur s'il existe déjà).
if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py createsuperuser --no-input 2>/dev/null || true
fi
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2
