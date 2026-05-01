from django.contrib import admin
from .models import Certification, UserCertification
@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['name','level','earned_count','is_active']
    prepopulated_fields = {'slug':('name',)}
@admin.register(UserCertification)
class UserCertificationAdmin(admin.ModelAdmin):
    list_display = ['user','certification','is_issued','progress_pct']
