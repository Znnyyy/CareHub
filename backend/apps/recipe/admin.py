from django.contrib import admin
from .models import Prescription, PrescriptionDetail

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['medical_record', 'status', 'dispensed_at', 'created_at']
    list_filter = ['status']

@admin.register(PrescriptionDetail)
class PrescriptionDetailAdmin(admin.ModelAdmin):
    list_display = ['prescription', 'medicine', 'quantity', 'dosage']