from django.urls import path
from . import views

urlpatterns = [
    path('',                                    views.CourseListView.as_view(),       name='course-list'),
    path('categories/',                         views.CategoryListView.as_view(),     name='category-list'),
    path('my-courses/',                         views.MyCoursesView.as_view(),        name='my-courses'),
    path('<slug:slug>/',                        views.CourseDetailView.as_view(),     name='course-detail'),
    path('<slug:slug>/enroll/',                 views.enroll,                         name='course-enroll'),
    path('<slug:slug>/lessons/<int:lesson_id>/complete/', views.mark_lesson_complete, name='lesson-complete'),
]
