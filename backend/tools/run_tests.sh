pip install --no-cache-dir -r requirements.txt
pip install --no-cache-dir -r requirements-dev.txt

export PYTHONPATH=./
pytest ./tests