from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['nik', 'full_name', 'gender', 'blood_type', 'phone', 'is_active']
    list_filter = ['gender', 'blood_type', 'is_active']
    search_fields = ['nik', 'full_name', 'phone']