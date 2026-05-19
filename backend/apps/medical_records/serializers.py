from rest_framework import serializers
from .models import MedicalRecord, LabResult
from apps.patients.serializers import PatientListSerializer
from apps.doctors.serializers import DoctorListSerializer

class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class MedicalRecordSerializer(serializers.ModelSerializer):
    lab_results = LabResultSerializer(many=True, read_only=True)

    class Meta:
        model = MedicalRecord
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class MedicalRecordListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    polyclinic_name = serializers.CharField(source='doctor.polyclinic.name', read_only=True)

    class Meta:
        model = MedicalRecord
        fields = ['id', 'record_number', 'patient_name', 'doctor_name', 'polyclinic_name', 'visit_date', 'diagnosis', 'status', 'created_at']