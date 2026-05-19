from rest_framework import serializers
from .models import Prescription, PrescriptionDetail
from apps.medicine.serializers import MedicineSerializer

class PrescriptionDetailSerializer(serializers.ModelSerializer):
    medicine_detail = MedicineSerializer(source='medicine', read_only=True)

    class Meta:
        model = PrescriptionDetail
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    details = PrescriptionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PrescriptionCreateSerializer(serializers.ModelSerializer):
    details = PrescriptionDetailSerializer(many=True)

    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        prescription = Prescription.objects.create(**validated_data)
        for detail in details_data:
            PrescriptionDetail.objects.create(prescription=prescription, **detail)
        return prescription