from pathlib import Path
from datetime import timedelta
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY', default='django-insecure-change-me-in-production-please')
DEBUG      = env('DEBUG', default=True)
# Find this line near the top:
ALLOWED_HOSTS = [
    '*',                           # Catch-all wildcard safe for Render/Vercel networks
    '.onrender.com',               # Allows any Render subdomain
    'techvoto.onrender.com',       # Your specific backend live URL
    '.vercel.app',                 # Keeps compatibility with your frontend Vercel routing
    'techvoto-lywk.vercel.app', 
    'techvoto-gilt.vercel.app',
    'localhost',
    '127.0.0.1',
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'drf_spectacular',
    'django_filters',
    # Techvoto apps
    'apps.users',
    'apps.courses',
    'apps.blog',
    'apps.contact',
    'apps.mentorship',
    'apps.certifications',
    'apps.labs',
    'apps.core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'techvoto.urls'
AUTH_USER_MODEL = 'users.User'

TEMPLATES = [{'BACKEND':'django.template.backends.django.DjangoTemplates','DIRS':[],'APP_DIRS':True,
              'OPTIONS':{'context_processors':['django.template.context_processors.debug','django.template.context_processors.request','django.contrib.auth.context_processors.auth','django.contrib.messages.context_processors.messages']}}]

WSGI_APPLICATION = 'techvoto.wsgi.application'

DATABASES = {'default': env.db('DATABASE_URL', default=f'sqlite:///{BASE_DIR}/db.sqlite3')}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME':'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME':'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME':'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME':'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MEDIA_URL  = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── DRF ──
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {'anon':'200/hour','user':'2000/hour'},
}

# ── JWT ──
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':  True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
# ── CORS ──
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://techvoto-gilt.vercel.app',
    'https://techvoto-1.onrender.com',  # Add your production frontend
])
CORS_ALLOW_CREDENTIALS = True

# ADD THIS BLOCK: Required by Django 4.0+ for secure post requests
# Update this block to include your Render URL
CSRF_TRUSTED_ORIGINS = [
    'https://techvoto-gilt.vercel.app',
    'https://techvoto-lywk.vercel.app',
    'https://techvoto.onrender.com',      
    'https://techvoto-1.onrender.com',
]

# ── Cache (Redis in production, LocMemCache in dev) ──
CACHES = {
    'default': {
        'BACKEND': env('CACHE_BACKEND', default='django.core.cache.backends.locmem.LocMemCache'),
        'LOCATION': env('REDIS_URL', default=''),
    }
}

# ── Email ──
EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST     = env('EMAIL_HOST',    default='smtp.gmail.com')
EMAIL_PORT     = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS  = True
EMAIL_HOST_USER     = env('EMAIL_HOST_USER',     default='')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL  = env('DEFAULT_FROM_EMAIL',  default='Techvoto <noreply@techvoto.com>')

# ── Spectacular (API docs) ──
SPECTACULAR_SETTINGS = {
    'TITLE': 'Techvoto API',
    'DESCRIPTION': 'Full API powering the Techvoto EdTech platform.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}


# ── Production security hardening ──
if not DEBUG:
    # ADD THIS LINE: Tells Django it's safely behind Vercel's HTTPS proxy
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    SECURE_BROWSER_XSS_FILTER      = True
    SECURE_CONTENT_TYPE_NOSNIFF    = True
    SECURE_HSTS_SECONDS            = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_SSL_REDIRECT            = True
    SESSION_COOKIE_SECURE          = True
    CSRF_COOKIE_SECURE             = True
    X_FRAME_OPTIONS                = 'DENY'