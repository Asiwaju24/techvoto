from django.contrib import admin
from .models import Category, Course, Lesson, Enrollment, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name','slug']
    prepopulated_fields = {'slug':('name',)}

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title','category','level','price_tier','is_published','student_count']
    list_filter  = ['level','price_tier','is_published','category']
    prepopulated_fields = {'slug':('title',)}

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user','course','progress_pct','enrolled_at']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['course','user','rating','created_at']
