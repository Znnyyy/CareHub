from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PolyclinicViewSet

router = DefaultRouter()
router.register(r'', PolyclinicViewSet, basename='polyclinic')

urlpatterns = [
    path('', include(router.urls)),
]