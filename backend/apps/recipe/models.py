from django.db import models
from apps.medical_records.models import MedicalRecord
from apps.medicine.models import Medicine

class Prescription(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Menunggu'),
        ('dispensed', 'Sudah Diberikan'),
        ('cancelled', 'Dibatalkan'),
    ]

    medical_record = models.OneToOneField(MedicalRecord, on_delete=models.CASCADE, related_name='prescription')
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    dispensed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resep - {self.medical_record.record_number}"

class PrescriptionDetail(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='details')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='prescription_details')
    quantity = models.IntegerField()
    dosage = models.CharField(max_length=100)
    instructions = models.TextField()

    def __str__(self):
        return f"{self.medicine.name} x{self.quantity}"