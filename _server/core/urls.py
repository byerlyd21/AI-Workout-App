from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('me/', view=views.me, name="current user"),
    path('workouts/', view=views.workouts, name="workouts"),
    path('publicWorkouts/', view=views.publicWorkouts, name="public workouts"),
    path('deleteWorkout/<int:workout_id>', views.delete_workout, name='delete_workout'),
    path('like_workout/<int:workout_id>/', views.like_workout, name='like_workout'),
    path('unlike_workout/<int:workout_id>/', views.unlike_workout, name='unlike_workout'),
    path('viewWorkout/<int:workout_id>/', views.view_workout, name='view_workout'),
    path('stats/', views.stats, name='stats'), 
]