from django.urls import path
from . import views
urlpatterns = [
    path('',             views.PostListView.as_view(),           name='post-list'),
    path('tags/',        views.TagListView.as_view(),            name='tag-list'),
    path('newsletter/',  views.NewsletterSubscribeView.as_view(),name='newsletter'),
    path('<slug:slug>/', views.PostDetailView.as_view(),         name='post-detail'),
]
