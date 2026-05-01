from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['email','first_name','last_name','plan','xp','streak','is_active','date_joined']
    search_fields = ['email','first_name','last_name']
    list_filter   = ['plan','is_active','is_staff']
    ordering      = ['-date_joined']
    fieldsets = (
        (None,          {'fields':('email','password')}),
        ('Personal',    {'fields':('first_name','last_name','avatar','bio')}),
        ('Techvoto',    {'fields':('plan','xp','streak')}),
        ('Permissions', {'fields':('is_active','is_staff','is_superuser','groups','user_permissions')}),
    )
    add_fieldsets = ((None,{'classes':('wide',),'fields':('email','first_name','last_name','password1','password2','plan')}),)
