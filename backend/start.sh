#!/bin/bash

echo "🚀 Iniciando aplicação Django..."

# Executa as migrations
python manage.py migrate --noinput

# Coleta arquivos estáticos
python manage.py collectstatic --noinput

# Define a porta (Render define automaticamente a variável PORT)
PORT=${PORT:-8000}

# Inicia o servidor na porta correta
python manage.py runserver 0.0.0.0:$PORT


