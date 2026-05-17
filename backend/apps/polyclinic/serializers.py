from rest_framework import serializers
from .models import Polyclinic

class PolyclinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polyclinic
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']