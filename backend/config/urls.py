from django.contrib import admin
from django.urls import include, path

from admissions.views import piece_fichier

urlpatterns = [
    path('admin/pieces/<int:pk>/', piece_fichier, name='piece-fichier'),
    path('admin/', admin.site.urls),
    path('api/', include('admissions.urls')),
]
