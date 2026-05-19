import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.accounts.models import User
from apps.polyclinic.models import Polyclinic
from apps.doctors.models import Doctor
from apps.patients.models import Patient
from apps.medicine.models import Medicine
from datetime import date

print("Seeding data...")

# 1. Users
admin = User.objects.create_superuser(
    username='admin', email='admin@carehub.com',
    password='Admin123!', role='admin'
)

dokter_user1 = User.objects.create_user(
    username='dr.budi', email='budi@carehub.com',
    password='Dokter123!', role='dokter'
)
dokter_user2 = User.objects.create_user(
    username='dr.sari', email='sari@carehub.com',
    password='Dokter123!', role='dokter'
)
pasien_user1 = User.objects.create_user(
    username='pasien1', email='pasien1@gmail.com',
    password='Pasien123!', role='pasien'
)
pasien_user2 = User.objects.create_user(
    username='pasien2', email='pasien2@gmail.com',
    password='Pasien123!', role='pasien'
)
print("Users created")

# 2. Polyclinic
poli_umum = Polyclinic.objects.create(name='Poli Umum', code='PLU', floor='Lantai 1')
poli_anak = Polyclinic.objects.create(name='Poli Anak', code='PLA', floor='Lantai 1')
poli_gigi = Polyclinic.objects.create(name='Poli Gigi', code='PLG', floor='Lantai 2')
poli_jantung = Polyclinic.objects.create(name='Poli Jantung', code='PLJ', floor='Lantai 2')
print("Polyclinics created")

# 3. Doctors
Doctor.objects.create(
    user=dokter_user1, nip='DOK001', full_name='Budi Santoso',
    specialization='Dokter Umum', polyclinic=poli_umum,
    phone='081234567890', schedule_day='Senin,Rabu,Jumat',
    schedule_start='08:00', schedule_end='14:00', quota=20
)
Doctor.objects.create(
    user=dokter_user2, nip='DOK002', full_name='Sari Dewi',
    specialization='Dokter Anak', polyclinic=poli_anak,
    phone='081234567891', schedule_day='Selasa,Kamis',
    schedule_start='09:00', schedule_end='15:00', quota=15
)
print("Doctors created")

# 4. Patients
Patient.objects.create(
    user=pasien_user1, nik='3201234567890001',
    full_name='Ahmad Fauzi', gender='M',
    birth_date=date(1990, 5, 15), blood_type='A',
    address='Jl. Merdeka No.1, Jakarta', phone='081111111111'
)
Patient.objects.create(
    user=pasien_user2, nik='3201234567890002',
    full_name='Dewi Rahayu', gender='F',
    birth_date=date(1995, 8, 20), blood_type='O',
    address='Jl. Sudirman No.5, Jakarta', phone='082222222222'
)
print("Patients created")

# 5. Medicine
medicines = [
    ('OBT001', 'Paracetamol 500mg', 'Paracetamol', 'analgesik', 'tablet', 100, 20, 2500),
    ('OBT002', 'Amoxicillin 500mg', 'Amoxicillin', 'antibiotik', 'kapsul', 50, 15, 5000),
    ('OBT003', 'Antasida Doen', 'Antasida', 'antasida', 'tablet', 80, 20, 1500),
    ('OBT004', 'Vitamin C 500mg', 'Ascorbic Acid', 'vitamin', 'tablet', 200, 30, 3000),
    ('OBT005', 'Ambroxol Sirup', 'Ambroxol', 'lainnya', 'sirup', 30, 10, 15000),
]
for code, name, generic, cat, unit, stock, min_stock, price in medicines:
    Medicine.objects.create(
        code=code, name=name, generic_name=generic,
        category=cat, unit=unit, stock=stock,
        min_stock=min_stock, price=price
    )
print("Medicines created")

print("\nSeeding selesai!")
print("Admin     : admin / Admin123!")
print("Dokter 1  : dr.budi / Dokter123!")
print("Dokter 2  : dr.sari / Dokter123!")
print("Pasien 1  : pasien1 / Pasien123!")
print("Pasien 2  : pasien2 / Pasien123!")