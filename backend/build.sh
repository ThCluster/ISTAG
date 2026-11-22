#!/usr/bin/env bash
# Build Render du backend Django (le disque persistant n'est pas monté pendant le build :
# les migrations sont lancées au démarrage, voir start.sh).
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
