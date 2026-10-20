from django.db.models import Count, Q
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Department, Designation, Employee, LeaveRequest
from .serializers import (
    DepartmentSerializer, DesignationSerializer, EmployeeListSerializer,
    EmployeeDetailSerializer, LeaveRequestSerializer, UserSerializer,
)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds basic user info to the JWT login response."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.select_related('department').all()
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department']


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('department', 'designation', 'manager').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'designation', 'status', 'gender']
    search_fields = ['employee_id', 'first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['date_joined', 'salary', 'first_name', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        return EmployeeDetailSerializer

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total = Employee.objects.count()
        active = Employee.objects.filter(status='ACTIVE').count()
        on_leave = Employee.objects.filter(status='ON_LEAVE').count()
        by_department = (
            Department.objects.annotate(count=Count('employees'))
            .values('name', 'count')
            .order_by('-count')
        )
        pending_leaves = LeaveRequest.objects.filter(status='PENDING').count()
        return Response({
            'total_employees': total,
            'active_employees': active,
            'on_leave': on_leave,
            'pending_leave_requests': pending_leaves,
            'employees_by_department': list(by_department),
        })


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.select_related('employee').all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'status', 'leave_type']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'APPROVED'
        leave.reviewed_by = request.user
        leave.save(update_fields=['status', 'reviewed_by'])
        return Response(LeaveRequestSerializer(leave).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'REJECTED'
        leave.reviewed_by = request.user
        leave.save(update_fields=['status', 'reviewed_by'])
        return Response(LeaveRequestSerializer(leave).data)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
