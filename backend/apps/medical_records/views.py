from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.utils import timezone
import random
from .models import MedicalRecord, LabResult
from .serializers import MedicalRecordSerializer, MedicalRecordListSerializer, LabResultSerializer

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'doctor', 'patient', 'visit_date']
    search_fields = ['record_number', 'patient__full_name', 'doctor__full_name', 'diagnosis']
    ordering_fields = ['visit_date', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return MedicalRecordListSerializer
        return MedicalRecordSerializer

    def generate_record_number(self):
        today = timezone.now().strftime('%Y%m%d')
        random_num = random.randint(1000, 9999)
        return f"RM-{today}-{random_num}"

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['record_number'] = self.generate_record_number()
        serializer = MedicalRecordSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def update_status(self, request, pk=None):
        record = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(MedicalRecord.STATUS_CHOICES):
            return Response({'error': 'Status tidak valid'}, status=status.HTTP_400_BAD_REQUEST)
        record.status = new_status
        record.save()
        return Response({'message': f'Status berhasil diubah ke {new_status}'})

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        records = MedicalRecord.objects.filter(visit_date=today).order_by('status')
        serializer = MedicalRecordListSerializer(records, many=True)
        return Response(serializer.data)

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all().order_by('-created_at')
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['medical_record']