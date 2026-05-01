from django.db import models
from django.conf import settings
class MentorProfile(models.Model):
    user          = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentor_profile')
    title         = models.CharField(max_length=120)
    company       = models.CharField(max_length=120)
    bio           = models.TextField()
    tags          = models.JSONField(default=list)
    slots_per_month   = models.PositiveSmallIntegerField(default=4)
    is_available      = models.BooleanField(default=True)
    availability_note = models.CharField(max_length=100, blank=True)
    requires_pro      = models.BooleanField(default=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    @property
    def avg_rating(self):
        from django.db.models import Avg
        r = self.sessions.aggregate(Avg('rating'))['rating__avg']
        return round(r, 2) if r else 5.0
    @property
    def review_count(self): return self.sessions.filter(rating__isnull=False).count()
    def __str__(self): return f'{self.user.full_name} @ {self.company}'

class MentorSession(models.Model):
    STATUS_CHOICES = [('pending','Pending'),('confirmed','Confirmed'),('completed','Completed'),('cancelled','Cancelled')]
    mentor       = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name='sessions')
    mentee       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentorship_sessions')
    scheduled_at = models.DateTimeField()
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    goal         = models.TextField(blank=True)
    rating       = models.PositiveSmallIntegerField(null=True, blank=True)
    feedback     = models.TextField(blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['-scheduled_at']
