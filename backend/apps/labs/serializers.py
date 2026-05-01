from rest_framework import serializers
from .models import Lab, LabAttempt
class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Lab
        fields = ['id','title','slug','description','emoji','level','estimated_hours','requires_pro']
class LabAttemptSerializer(serializers.ModelSerializer):
    lab = LabSerializer(read_only=True)
    class Meta:
        model  = LabAttempt
        fields = ['id','lab','status','started_at','completed_at','sandbox_url']
