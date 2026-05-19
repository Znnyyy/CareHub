from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from .models import Prescription, PrescriptionDetail
from .serializers import PrescriptionSerializer, PrescriptionCreateSerializer, PrescriptionDetailSerializer
from apps.medicine.models import Medicine

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['created', 'updated']:
            return PrescriptionCreateSerializer
        return PrescriptionSerializer
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = PrescriptionCreateSerializer(data=request.data)
        if serializer.is_valid():
            details_data = request.data.get('details', [])

            for detail in details_data:
                medicine = Medicine.objects.get(id=detail['medicine'])
                if medicine.stock < detail['quantity']:
                    return Response(
                        {'error': f'Stock {medicine.name} tidak mencukupi. Stock tersedia: {medicine.stock}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            prescription = serializer.save()

            for detail in prescription.details.all():
                medicine = detail.medicine
                medicine.stock -= detail.quantity
                medicine.save()

            return Response(PrescriptionSerializer(prescription).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def dispense(self, request, pk=None):
        prescription = self.get_object()

        if prescription.status == 'dispensed':
            return Response({'error': 'Resep sudah pernah diberikan'}, status=status.HTTP_400_BAD_REQUEST)
        
        prescription.status = 'dispensed'
        prescription.dispensed_at = timezone.now()
        prescription.save()

        return Response({'message': 'Resep berhasil diberikan ke pasien'})
    
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def cancel(self, request, pk=None):
        prescription = self.get_object()

        if prescription.status == 'dispensed':
            return Response({'error': 'Resep yang sudah diberikan tidak bisa dibatalkan'}, status=status.HTTP_400_BAD_REQUEST)
        
        for detail in prescription.details.all():
            medicine = detail.medicine
            medicine.stock += detail.quantity
            medicine.save()

        prescription.status = 'cancelled'
        prescription.save()

        return Response({'message': 'Resep berhasil dibatalkan, stock obat dikembalikan'})