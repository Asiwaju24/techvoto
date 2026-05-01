from rest_framework import serializers
from .models import Certification, UserCertification
class CertificationSerializer(serializers.ModelSerializer):
    earned_count = serializers.ReadOnlyField()
    class Meta:
        model  = Certification
        fields = ['id','name','slug','description','emoji','level','hours_min','hours_max','earned_count']
class UserCertificationSerializer(serializers.ModelSerializer):
    certification = CertificationSerializer(read_only=True)
    verify_url    = serializers.ReadOnlyField()
    class Meta:
        model  = UserCertification
        fields = ['id','certification','is_issued','issued_at','progress_pct','token','verify_url']
