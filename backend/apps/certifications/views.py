from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Certification, UserCertification
from .serializers import CertificationSerializer, UserCertificationSerializer
class CertificationListView(generics.ListAPIView):
    queryset           = Certification.objects.filter(is_active=True)
    serializer_class   = CertificationSerializer
    permission_classes = [permissions.AllowAny]
class MyCertificationsView(generics.ListAPIView):
    serializer_class   = UserCertificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return UserCertification.objects.filter(user=self.request.user).select_related('certification')
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_cert(request, token):
    cert = get_object_or_404(UserCertification, token=token, is_issued=True)
    return Response({'valid':True,'holder':cert.user.full_name,'certification':cert.certification.name,'issued_at':cert.issued_at})
