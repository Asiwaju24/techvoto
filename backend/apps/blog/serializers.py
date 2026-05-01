from rest_framework import serializers
from .models import Post, Tag, NewsletterSubscription

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name','slug']

class PostListSerializer(serializers.ModelSerializer):
    tags        = TagSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()
    class Meta:
        model  = Post
        fields = ['id','title','slug','excerpt','tags','emoji','read_time','author_name','is_featured','published_at']
    def get_author_name(self, obj): return obj.author.full_name if obj.author else 'Techvoto Team'

class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ['content']

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = NewsletterSubscription
        fields = ['email']
