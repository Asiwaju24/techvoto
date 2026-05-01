from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email: raise ValueError('Email required')
        email = self.normalize_email(email)
        user  = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    PLAN_CHOICES = [('free','Free'),('pro','Pro'),('teams','Teams')]
    email       = models.EmailField(unique=True)
    first_name  = models.CharField(max_length=50)
    last_name   = models.CharField(max_length=50)
    avatar      = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio         = models.TextField(blank=True)
    plan        = models.CharField(max_length=10, choices=PLAN_CHOICES, default='free')
    xp          = models.PositiveIntegerField(default=0)
    streak      = models.PositiveIntegerField(default=0)
    last_active = models.DateField(auto_now=True)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    objects     = UserManager()
    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name','last_name']
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
    def __str__(self): return self.email
    @property
    def full_name(self): return f'{self.first_name} {self.last_name}'
    @property
    def initials(self): return f'{self.first_name[:1]}{self.last_name[:1]}'.upper()
