from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Lab, LabAttempt
from .serializers import LabSerializer, LabAttemptSerializer
class LabListView(generics.ListAPIView):
    queryset           = Lab.objects.filter(is_active=True)
    serializer_class   = LabSerializer
    permission_classes = [permissions.AllowAny]
class LaunchLabView(generics.CreateAPIView):
    serializer_class   = LabAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    def create(self, request, *args, **kwargs):
        lab = get_object_or_404(Lab, slug=self.kwargs['slug'], is_active=True)
        if lab.requires_pro and request.user.plan == 'free':
            return Response({'detail':'Pro plan required.'}, status=status.HTTP_403_FORBIDDEN)
        attempt = LabAttempt.objects.create(
            user=request.user, lab=lab,
            sandbox_url=f'https://sandbox.techvoto.com/labs/{lab.slug}/{request.user.id}'
        )
        return Response(LabAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)
