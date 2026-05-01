from django.db import models
from django.conf import settings
class Lab(models.Model):
    LEVEL_CHOICES = [('beginner','Beginner'),('intermediate','Intermediate'),('advanced','Advanced')]
    title           = models.CharField(max_length=200)
    slug            = models.SlugField(unique=True)
    description     = models.TextField()
    emoji           = models.CharField(max_length=10, default='🔬')
    level           = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    estimated_hours = models.DecimalField(max_digits=4, decimal_places=1, default=2.0)
    is_active       = models.BooleanField(default=True)
    requires_pro    = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.title
class LabAttempt(models.Model):
    STATUS_CHOICES = [('active','Active'),('completed','Completed'),('expired','Expired')]
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lab_attempts')
    lab          = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='attempts')
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    started_at   = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    sandbox_url  = models.URLField(blank=True)
