from django.db import models
class ContactMessage(models.Model):
    TYPE_CHOICES   = [('General','General'),('Enterprise','Enterprise'),('Partnership','Partnership')]
    STATUS_CHOICES = [('new','New'),('read','Read'),('resolved','Resolved')]
    first_name = models.CharField(max_length=60)
    last_name  = models.CharField(max_length=60)
    email      = models.EmailField()
    company    = models.CharField(max_length=120, blank=True)
    type       = models.CharField(max_length=20, choices=TYPE_CHOICES, default='General')
    subject    = models.CharField(max_length=200)
    message    = models.TextField()
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['-created_at']
    def __str__(self): return f'{self.email} — {self.subject}'
