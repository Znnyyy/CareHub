from django.db import models

class Medicine(models.Model):
    UNIT_CHOICES = [
        ('tablet', 'Tablet'), ('kapsul', 'Kapsul'),
        ('sirup', 'Sirup'), ('salep', 'Salep'), ('injeksi', 'Injeksi'),
    ]
    CATEGORY_CHOICES = [
        ('antibiotik', 'Antibiotik'), ('analgesik', 'Analgesik'),
        ('vitamin', 'Vitamin'), ('antasida', 'Antasida'), ('lainnya', 'Lainnya'),
    ]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    generic_name = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)
    stock = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=10)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    @property
    def is_low_stock(self):
        return self.stock <= self.min_stock