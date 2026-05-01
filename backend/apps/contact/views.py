from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import ContactMessageSerializer
class ContactView(generics.CreateAPIView):
    serializer_class   = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    def create(self, request, *args, **kwargs):
        s = self.get_serializer(data=request.data)
        s.is_valid(raise_exception=True); s.save()
        return Response({'detail':"Message received. We'll respond within 4 hours."}, status=status.HTTP_201_CREATED)
