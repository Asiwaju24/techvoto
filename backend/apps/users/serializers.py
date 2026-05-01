from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    initials  = serializers.ReadOnlyField()
    class Meta:
        model  = User
        fields = ['id','email','first_name','last_name','full_name','initials','avatar','bio','plan','xp','streak','date_joined']
        read_only_fields = ['id','xp','streak','date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model  = User
        fields = ['email','first_name','last_name','password','password2','plan']
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password':'Passwords do not match.'})
        return data
    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    def validate_old_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value
    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
