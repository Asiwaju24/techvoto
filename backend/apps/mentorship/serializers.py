from rest_framework import serializers
from .models import MentorProfile, MentorSession
from apps.users.serializers import UserSerializer
class MentorProfileSerializer(serializers.ModelSerializer):
    user         = UserSerializer(read_only=True)
    avg_rating   = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    class Meta:
        model  = MentorProfile
        fields = ['id','user','title','company','bio','tags','slots_per_month','is_available','availability_note','requires_pro','avg_rating','review_count']
class MentorSessionSerializer(serializers.ModelSerializer):
    mentor_name = serializers.SerializerMethodField()
    class Meta:
        model  = MentorSession
        fields = ['id','mentor','mentor_name','scheduled_at','status','goal','rating','feedback','created_at']
        read_only_fields = ['status','created_at']
    def get_mentor_name(self, obj): return obj.mentor.user.full_name
