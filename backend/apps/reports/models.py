from django.db import models
from apps.accounts.models import User

class Report(models.Model):
    REPORT_TYPE_CHOICES = [
        ('visit', 'Laporan Kunjungan'),
        ('medicine', 'Laporan Obat'),
        ('diagnosis', 'Laporan Diagnosa'),
        ('patient', 'Laporan Pasien'),
    ]
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('xlsx', 'Excel'),
    ]

    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    format = models.CharField(max_length=5, choices=FORMAT_CHOICES)
    date_from = models.DateField()
    date_to = models.DateField()
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reports')
    file = models.FileField(upload_to='reports/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%d/%m/%Y')}"