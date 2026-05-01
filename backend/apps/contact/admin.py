from django.contrib import admin
from .models import ContactMessage
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['email','first_name','type','subject','status','created_at']
    list_filter  = ['type','status']
