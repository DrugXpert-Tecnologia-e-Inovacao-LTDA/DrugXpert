from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = None  # Remove o campo padrão
    profession = models.CharField(max_length=100, blank=True)
    lab = models.CharField(max_length=100, blank=True)
    is_student = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
