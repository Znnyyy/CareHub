from django.contrib import admin
from .models import Medicine

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'category', 'unit', 'stock', 'min_stock', 'price', 'is_active']
    list_filter = ['category', 'unit', 'is_active']
    search_fields = ['code', 'name', 'generic_name']