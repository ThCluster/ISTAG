from django.contrib.admin.apps import AdminConfig


class IstagAdminConfig(AdminConfig):
    """Remplace le site d'administration par défaut par celui de l'ISTAG."""

    default_site = 'config.admin.IstagAdminSite'
