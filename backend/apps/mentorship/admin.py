from django.contrib import admin
from .models import MentorProfile, MentorSession
@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ['user','title','company','is_available']
@admin.register(MentorSession)
class MentorSessionAdmin(admin.ModelAdmin):
    list_display = ['mentee','mentor','scheduled_at','status']
