from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['nip', 'full_name', 'specialization', 'polyclinic', 'is_active']
    list_filter = ['polyclinic', 'is_active']
    search_fields = ['nip', 'full_name', 'specialization']