import os
import dj_database_url

from pathlib import Path


# Diretório base do projeto
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-va-xdnf^3xrkhann+1w5cmwz_sw2we%045y@!*q%2)h3+g4^jm'

DEBUG = True

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

# Aplicações instaladas
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'accounts',
    'corsheaders',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Make sure this is at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  
]

# CORS settings - replacing CORS_ALLOW_ALL_ORIGINS
CORS_ALLOW_ALL_ORIGINS = False  # Change from True to False
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Configuração do Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ]
}

# Modelo de usuário personalizado
AUTH_USER_MODEL = 'accounts.CustomUser'

# Configuração do Djoser
DJOSER = {
    'USER_CREATE_PASSWORD_RETYPE': True,
    'LOGIN_FIELD': 'email',
    'USER_ID_FIELD': 'id',
    'SERIALIZERS': {
        'user': 'accounts.serializers.UserSerializer',
        'current_user': 'accounts.serializers.UserSerializer',
    },
}

ROOT_URLCONF = 'backend.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'backend.wsgi.application'

# Banco de dados
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True
    )
}

# Validação de senhas
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internacionalização
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Arquivos estáticos
STATIC_URL = 'static/'

# Corrige o erro do collectstatic
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configuração do WhiteNoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Campo padrão para chaves primárias
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
