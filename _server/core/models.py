from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Workout(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.TextField()
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isPublic = models.BooleanField(default=False)

class Exercise(models.Model):
    workout = models.ForeignKey(Workout, related_name='exercises', on_delete=models.CASCADE)
    name = models.TextField()

class WorkoutLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_workout = models.ForeignKey(Workout, related_name='original_likes', on_delete=models.CASCADE)
    copied_workout = models.ForeignKey(Workout, related_name='copied_likes', on_delete=models.CASCADE)

class Stats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    height = models.TextField()
    weight = models.TextField()
    age = models.TextField()
    maxBench = models.TextField()
    maxSquat = models.TextField()
    maxDeadlift = models.TextField()
    