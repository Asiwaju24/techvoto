from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=60, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=10, blank=True)
    class Meta: verbose_name_plural = 'categories'
    def __str__(self): return self.name

class Course(models.Model):
    LEVEL_CHOICES = [('beginner','Beginner'),('intermediate','Intermediate'),('advanced','Advanced')]
    PRICE_CHOICES = [('free','Free'),('pro','Pro')]
    title          = models.CharField(max_length=200)
    slug           = models.SlugField(unique=True)
    description    = models.TextField()
    category       = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    level          = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    price_tier     = models.CharField(max_length=10, choices=PRICE_CHOICES, default='free')
    emoji          = models.CharField(max_length=10, default='📚')
    duration_hours = models.PositiveSmallIntegerField(default=0)
    total_lessons  = models.PositiveSmallIntegerField(default=0)
    is_published   = models.BooleanField(default=False)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)
    class Meta: ordering = ['-created_at']
    def __str__(self): return self.title
    @property
    def student_count(self): return self.enrollments.count()
    @property
    def avg_rating(self):
        from django.db.models import Avg
        r = self.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(r, 2) if r else None

class Lesson(models.Model):
    course   = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title    = models.CharField(max_length=200)
    order    = models.PositiveSmallIntegerField(default=0)
    content  = models.TextField(blank=True)
    video_url= models.URLField(blank=True)
    duration_minutes  = models.PositiveSmallIntegerField(default=0)
    is_free_preview   = models.BooleanField(default=False)
    class Meta: ordering = ['order']

class Enrollment(models.Model):
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course       = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at  = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    progress_pct = models.PositiveSmallIntegerField(default=0)
    class Meta: unique_together = ['user','course']

class Review(models.Model):
    course     = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating     = models.PositiveSmallIntegerField()
    comment    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ['course','user']


class LessonProgress(models.Model):
    enrollment   = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson       = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed    = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['enrollment', 'lesson']

    def __str__(self):
        return f'{self.enrollment.user.email} — {self.lesson.title}'
