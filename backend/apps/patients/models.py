from django.db import models
from apps.accounts.models import User

class Patient(models.Model):
    GENDER_CHOICES = [('M', 'Laki-laki'), ('F', 'Perempuan')]
    BLOOD_CHOICES = [('A', 'A'), ('B', 'B'), ('AB', 'AB'), ('O', 'O')]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    nik = models.CharField(max_length=16, unique=True)
    full_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    brith_date = models.DateField()
    blood_type = models.CharField(max_length=3, choices=BLOOD_CHOICES, blank=True, null=True)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    emergency_contact = models.CharField(max_length=15, blank=True, null=True)
    photo_ktp = models.ImageField(upload_to='ktp/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.nik }"