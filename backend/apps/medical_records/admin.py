from django.contrib import admin
from .models import MedicalRecord, LabResult

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['record_number', 'patient', 'doctor', 'visit_date', 'status']
    list_filter = ['status', 'visit_date']
    search_fields = ['record_number', 'patient__full_name', 'doctor__full_name']

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ['test_name', 'medical_record', 'tested_at']
    search_fields = ['test_name', 'medical_record__record_number']