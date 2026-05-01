from django.urls import path
from . import views
urlpatterns = [
    path('',                    views.LabListView.as_view(),   name='lab-list'),
    path('<slug:slug>/launch/', views.LaunchLabView.as_view(), name='lab-launch'),
]
