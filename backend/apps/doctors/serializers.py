from rest_framework import serializers
from .models import Doctor
from apps.polyclinic.serializers import PolyclinicSerializer

class DoctorSerializer(serializers.ModelSerializer):
    polyclinic_detail = PolyclinicSerializer(source='polyclinic', read_only=True)

    class Meta:
        model = Doctor
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class DoctorListSerializer(serializers.ModelSerializer):
    polyclinic_name = serializers.CharField(source='polyclinic.name', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'nip', 'full_name', 'specialization', 'polyclinic_name', 'phone', 'schedule_day', 'schedule_start', 'schedule_end', 'quota', 'is_active']