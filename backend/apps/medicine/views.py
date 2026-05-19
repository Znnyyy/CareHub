from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Medicine
from .serializers import MedicineSerializer
from apps.accounts.permissions import IsAdminOrReadOnly

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all().order_by('name')
    serializer_class = MedicineSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'unit', 'is_active']
    search_fields = ['name', 'code', 'generic_name']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        medicines = Medicine.objects.filter(is_active=True)
        low = [m for m in medicines if m.is_low_stock]
        serializer = MedicineSerializer(low, many=True)
        return Response(serializer.data)