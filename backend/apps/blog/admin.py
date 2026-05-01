from django.contrib import admin
from .models import Post, Tag, NewsletterSubscription

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title','author','is_published','is_featured','published_at']
    list_filter  = ['is_published','is_featured']
    prepopulated_fields = {'slug':('title',)}
    filter_horizontal = ['tags']

admin.site.register(Tag)
admin.site.register(NewsletterSubscription)
