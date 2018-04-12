from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin

from .views import (
    HomeView,
    login_view,
    logout_view,
)

urlpatterns = [
    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^login/$', login_view, name='login'),
    url(r'^logout/$', logout_view, name='logout'),
    url(r'^admin/', admin.site.urls),

    url(r'^user-api/', include('accounts.api.urls', namespace='user-api')),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
