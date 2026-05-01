from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import MentorProfile, MentorSession
from .serializers import MentorProfileSerializer, MentorSessionSerializer
class MentorListView(generics.ListAPIView):
    queryset           = MentorProfile.objects.select_related('user').order_by('-created_at')
    serializer_class   = MentorProfileSerializer
    permission_classes = [permissions.AllowAny]
class MentorDetailView(generics.RetrieveAPIView):
    queryset           = MentorProfile.objects.all()
    serializer_class   = MentorProfileSerializer
    permission_classes = [permissions.AllowAny]
class BookSessionView(generics.CreateAPIView):
    serializer_class   = MentorSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        mentor = MentorProfile.objects.get(pk=self.kwargs['pk'])
        if mentor.requires_pro and self.request.user.plan == 'free':
            raise PermissionDenied('Pro plan required to book sessions.')
        serializer.save(mentee=self.request.user, mentor=mentor)
class MySessionsView(generics.ListAPIView):
    serializer_class   = MentorSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return MentorSession.objects.filter(mentee=self.request.user).select_related('mentor__user')
