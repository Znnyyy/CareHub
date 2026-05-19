from django.contrib import admin
from .models import Polyclinic

@admin.register(Polyclinic)
class PolyclinicAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'floor', 'is_active']
    list_filter = ['is_active']
    search_fields = ['code', 'name']