#!/usr/bin/env bash
set -o errexit

export PYTHONPATH="${PYTHONPATH}:/opt/render/project/src"

pip install -r requirements.txt

python manage.py migrate