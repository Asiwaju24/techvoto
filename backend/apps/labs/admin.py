from django.contrib import admin
from .models import Lab, LabAttempt
@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ['title','level','estimated_hours','requires_pro','is_active']
    prepopulated_fields = {'slug':('title',)}
@admin.register(LabAttempt)
class LabAttemptAdmin(admin.ModelAdmin):
    list_display = ['user','lab','status','started_at']
