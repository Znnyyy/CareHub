from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalRecordViewSet, LabResultViewSet

router = DefaultRouter()
router.register(r'', MedicalRecordViewSet, basename='medical-record')
router.register(r'lab-results', LabResultViewSet, basename='lab-result')

urlpatterns = [
    path('', include(router.urls)),
]