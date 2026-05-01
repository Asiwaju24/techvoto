# ── apps/courses/models.py  (LessonProgress added) ──
# This model tracks individual lesson completion per enrollment.
# It was referenced in views but missing from models. Add this class
# at the bottom of apps/courses/models.py:
#
# class LessonProgress(models.Model):
#     enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lesson_progress')
#     lesson     = models.ForeignKey(Lesson, on_delete=models.CASCADE)
#     completed  = models.BooleanField(default=False)
#     completed_at = models.DateTimeField(null=True, blank=True)
#     class Meta:
#         unique_together = ['enrollment','lesson']
#
# The seed_data command doesn't require this — it's already handled.
# It is included in the full models.py below.
