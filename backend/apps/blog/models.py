from django.db import models
from django.conf import settings

class Tag(models.Model):
    name = models.CharField(max_length=40, unique=True)
    slug = models.SlugField(unique=True)
    def __str__(self): return self.name

class Post(models.Model):
    title        = models.CharField(max_length=200)
    slug         = models.SlugField(unique=True)
    author       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='posts')
    excerpt      = models.TextField(max_length=400)
    content      = models.TextField()
    tags         = models.ManyToManyField(Tag, blank=True)
    emoji        = models.CharField(max_length=10, default='📝')
    read_time    = models.PositiveSmallIntegerField(default=5)
    is_published = models.BooleanField(default=False)
    is_featured  = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['-published_at','-created_at']
    def __str__(self): return self.title

class NewsletterSubscription(models.Model):
    email      = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active  = models.BooleanField(default=True)
    def __str__(self): return self.email
