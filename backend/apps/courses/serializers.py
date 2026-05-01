from rest_framework import serializers
from .models import Category, Course, Lesson, Enrollment, Review, LessonProgress


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'icon']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Lesson
        fields = ['id', 'title', 'order', 'duration_minutes', 'is_free_preview', 'video_url']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

    def get_user_name(self, obj):
        return obj.user.full_name


class CourseListSerializer(serializers.ModelSerializer):
    category      = CategorySerializer(read_only=True)
    avg_rating    = serializers.ReadOnlyField()
    student_count = serializers.ReadOnlyField()

    class Meta:
        model  = Course
        fields = ['id', 'title', 'slug', 'description', 'category', 'level',
                  'price_tier', 'emoji', 'duration_hours', 'total_lessons',
                  'avg_rating', 'student_count']


class CourseListWithLessonsSerializer(CourseListSerializer):
    """Used in my-courses so the LMS can show lesson list in-dashboard."""
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + ['lessons']


class CourseDetailSerializer(CourseListSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + ['lessons', 'reviews', 'created_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListWithLessonsSerializer(read_only=True)

    class Meta:
        model  = Enrollment
        fields = ['id', 'course', 'enrolled_at', 'progress_pct', 'completed_at']


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.SerializerMethodField()

    class Meta:
        model  = LessonProgress
        fields = ['id', 'lesson', 'lesson_title', 'completed', 'completed_at']

    def get_lesson_title(self, obj):
        return obj.lesson.title
