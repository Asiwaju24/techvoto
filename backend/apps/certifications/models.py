import uuid
from django.db import models
from django.conf import settings
class Certification(models.Model):
    LEVEL_CHOICES = [('beginner','Beginner'),('intermediate','Intermediate'),('advanced','Advanced')]
    name        = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True)
    description = models.TextField()
    emoji       = models.CharField(max_length=10, default='🏆')
    level       = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    hours_min   = models.PositiveSmallIntegerField(default=10)
    hours_max   = models.PositiveSmallIntegerField(default=20)
    is_active   = models.BooleanField(default=True)
    def __str__(self): return self.name
    @property
    def earned_count(self): return self.user_certs.filter(is_issued=True).count()
class UserCertification(models.Model):
    user          = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certifications')
    certification = models.ForeignKey(Certification, on_delete=models.CASCADE, related_name='user_certs')
    issued_at     = models.DateTimeField(auto_now_add=True)
    is_issued     = models.BooleanField(default=False)
    token         = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    progress_pct  = models.PositiveSmallIntegerField(default=0)
    class Meta: unique_together = ['user','certification']
    @property
    def verify_url(self): return f'https://techvoto.com/verify/{self.token}'
