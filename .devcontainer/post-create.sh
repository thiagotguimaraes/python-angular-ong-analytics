#!/bin/bash

echo "Setting up Python environment inside devcontainer..."

cd /app || exit

python -m venv ong-venv
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt

echo "✅ Backend ready in dev container."
