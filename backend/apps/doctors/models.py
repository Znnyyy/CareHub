from django.db import models
from apps.accounts.models import User
from apps.polyclinic.models import Polyclinic

class Doctor(models.Model):
    DAYS_CHOICES = [
        ('Senin', 'Senin'), ('Selasa', 'Selasa'), ('Rabu', 'Rabu'),
        ('Kamis', 'Kamis'), ('Jumat', 'Jumat'), ('Sabtu', 'Sabtu')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    nip = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    polyclinic = models.ForeignKey(Polyclinic, on_delete=models.SET_NULL, null=True, related_name='doctors')
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    schedule_day = models.CharField(max_length=100)
    schedule_start = models.TimeField()
    schedule_end = models.TimeField()
    quota = models.IntegerField(default=20)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.full_name} - {self.specialization}"