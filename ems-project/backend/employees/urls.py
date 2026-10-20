from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, DesignationViewSet, EmployeeViewSet,
    LeaveRequestViewSet, CurrentUserView,
)

router = DefaultRouter()
router.register('departments', DepartmentViewSet, basename='department')
router.register('designations', DesignationViewSet, basename='designation')
router.register('employees', EmployeeViewSet, basename='employee')
router.register('leave-requests', LeaveRequestViewSet, basename='leave-request')

urlpatterns = [

    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('', include(router.urls)),          

]


