from rest_framework import generics, filters, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Course, Category, Enrollment
from .serializers import CourseListSerializer, CourseDetailSerializer, CategorySerializer, EnrollmentSerializer

class CategoryListView(generics.ListAPIView):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]

class CourseListView(generics.ListAPIView):
    queryset           = Course.objects.filter(is_published=True).select_related('category')
    serializer_class   = CourseListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['title','description','category__name']
    ordering_fields    = ['created_at','duration_hours']

    def get_queryset(self):
        qs    = super().get_queryset()
        level = self.request.query_params.get('level')
        price = self.request.query_params.get('price')
        cat   = self.request.query_params.get('category')
        if level: qs = qs.filter(level=level)
        if price: qs = qs.filter(price_tier=price)
        if cat:   qs = qs.filter(category__slug=cat)
        return qs

class CourseDetailView(generics.RetrieveAPIView):
    queryset           = Course.objects.filter(is_published=True)
    serializer_class   = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = 'slug'

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def enroll(request, slug):
    course = get_object_or_404(Course, slug=slug, is_published=True)
    if course.price_tier == 'pro' and request.user.plan == 'free':
        return Response({'detail':'Pro plan required for this course.'}, status=status.HTTP_403_FORBIDDEN)
    enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
    code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return Response(EnrollmentSerializer(enrollment).data, status=code)

class MyCoursesView(generics.ListAPIView):
    serializer_class   = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user).select_related('course','course__category')


from .models import Lesson, LessonProgress
from .serializers import LessonProgressSerializer
import django.utils.timezone as tz


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_lesson_complete(request, slug, lesson_id):
    """Mark a specific lesson as complete and recalculate course progress."""
    course     = get_object_or_404(Course, slug=slug, is_published=True)
    lesson     = get_object_or_404(Lesson, id=lesson_id, course=course)
    enrollment = get_object_or_404(Enrollment, user=request.user, course=course)

    progress, _ = LessonProgress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
    if not progress.completed:
        progress.completed    = True
        progress.completed_at = tz.now()
        progress.save()

        # Recalculate overall course progress
        total_lessons     = course.lessons.count()
        completed_lessons = enrollment.lesson_progress.filter(completed=True).count()
        if total_lessons > 0:
            enrollment.progress_pct = round((completed_lessons / total_lessons) * 100)
        if enrollment.progress_pct >= 100:
            enrollment.completed_at = tz.now()
        enrollment.save()

        # Award XP to user
        request.user.xp += 50
        request.user.save(update_fields=['xp'])

    return Response({
        'lesson_id':    lesson.id,
        'completed':    progress.completed,
        'progress_pct': enrollment.progress_pct,
        'xp_awarded':   50,
    })
