from django.contrib import admin
from django.urls    import path, include
from django.conf    import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    # API docs
    path('api/schema/',  SpectacularAPIView.as_view(),                             name='schema'),
    path('api/docs/',    SpectacularSwaggerView.as_view(url_name='schema'),         name='swagger-ui'),
    path('api/redoc/',   SpectacularRedocView.as_view(url_name='schema'),           name='redoc'),
    # App APIs
    path('api/auth/',           include('apps.users.urls')),
    path('api/courses/',        include('apps.courses.urls')),
    path('api/blog/',           include('apps.blog.urls')),
    path('api/contact/',        include('apps.contact.urls')),
    path('api/mentorship/',     include('apps.mentorship.urls')),
    path('api/certifications/', include('apps.certifications.urls')),
    path('api/labs/',           include('apps.labs.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
