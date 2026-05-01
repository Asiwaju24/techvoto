from django.urls import path
from . import views
urlpatterns = [
    path('',               views.MentorListView.as_view(),   name='mentor-list'),
    path('my-sessions/',   views.MySessionsView.as_view(),   name='my-sessions'),
    path('<int:pk>/',      views.MentorDetailView.as_view(), name='mentor-detail'),
    path('<int:pk>/book/', views.BookSessionView.as_view(),  name='book-session'),
]
