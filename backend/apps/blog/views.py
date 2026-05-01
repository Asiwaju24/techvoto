from rest_framework import generics, filters, permissions, status
from rest_framework.response import Response
from .models import Post, Tag, NewsletterSubscription
from .serializers import PostListSerializer, PostDetailSerializer, TagSerializer, NewsletterSerializer

class TagListView(generics.ListAPIView):
    queryset           = Tag.objects.all()
    serializer_class   = TagSerializer
    permission_classes = [permissions.AllowAny]

class PostListView(generics.ListAPIView):
    queryset           = Post.objects.filter(is_published=True).prefetch_related('tags')
    serializer_class   = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ['title','excerpt','tags__name']

    def get_queryset(self):
        qs  = super().get_queryset()
        tag = self.request.query_params.get('tag')
        if tag: qs = qs.filter(tags__slug=tag)
        return qs

class PostDetailView(generics.RetrieveAPIView):
    queryset           = Post.objects.filter(is_published=True)
    serializer_class   = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = 'slug'

class NewsletterSubscribeView(generics.CreateAPIView):
    serializer_class   = NewsletterSerializer
    permission_classes = [permissions.AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        _, created = NewsletterSubscription.objects.get_or_create(email=serializer.validated_data['email'])
        msg = 'Subscribed successfully!' if created else 'You are already subscribed.'
        return Response({'detail': msg}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
