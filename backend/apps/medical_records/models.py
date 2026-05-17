from django.db import models
from apps.patients.models import Patient
from apps.doctors.models import Doctor

class MedicalRecord(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Menunggu'),
        ('in_progress', 'Dalam Pemeriksaan'),
        ('done', 'Selesai'),
        ('cancelled', 'Dibatalkan'),
    ]

    record_number = models.CharField(max_length=20, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='medical_records')
    visit_date = models.DateField()
    complaint = models.TextField()
    diagnosis = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    blood_pressure = models.CharField(max_length=20, blank=True, null=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    temperature = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='waiting')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.record_number} - {self.patient.full_name}"

class LabResult(models.Model):
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='lab_results')
    test_name = models.CharField(max_length=100)
    result = models.TextField()
    file = models.FileField(upload_to='lab_results/', blank=True, null=True)
    tested_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.test_name} - {self.medical_record.record_number}"