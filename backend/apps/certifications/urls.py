from django.urls import path
from . import views
urlpatterns = [
    path('',                     views.CertificationListView.as_view(), name='cert-list'),
    path('mine/',                views.MyCertificationsView.as_view(),  name='my-certs'),
    path('verify/<uuid:token>/', views.verify_cert,                     name='verify-cert'),
]
