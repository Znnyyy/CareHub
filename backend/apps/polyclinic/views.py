from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Polyclinic
from .serializers import PolyclinicSerializer
from apps.accounts.permissions import IsAdminOrReadOnly

class PolyclinicViewSet(viewsets.ModelViewSet):
    queryset = Polyclinic.objects.all().order_by('name')
    serializer_class = PolyclinicSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code']