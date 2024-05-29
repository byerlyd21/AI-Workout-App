from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponseServerError
from django.forms.models import model_to_dict
from .models import Workout, WorkoutLike, Exercise, Stats

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.jsx"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.jsx"]["css"][0]
    }
    return render(req, "core/index.html", context)


@login_required
def me(req):
    return JsonResponse({"user": model_to_dict(req.user)})

@login_required
@require_POST
def like_workout(req, workout_id):
    try:
        workout = Workout.objects.get(id=workout_id)
        created = WorkoutLike.objects.get_or_create(user=req.user, original_workout=workout)

        if not created:
            # The like already existed, so the user is trying to like again
            return JsonResponse({'status': 'error', 'message': 'Already liked'}, status=400)

        return JsonResponse({'status': 'success'})

    except Workout.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Workout not found'}, status=404)

@login_required
def unlike_workout(req, workout_id):
    if req.method == "DELETE":
        try:
            workout_like = WorkoutLike.objects.get(user=req.user, original_workout=workout_id)
            copied_workout = workout_like.copied_workout
            workout_like.delete()
            copied_workout.delete()

            return JsonResponse({'status': 'success'})

        except WorkoutLike.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Like not found'}, status=404)
        except Workout.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Copied workout not found'}, status=404)

@login_required
def workouts(req):
    if req.method == "POST":
        body = json.loads(req.body)

        if 'original_workout_id' in body:
            original_workout = Workout.objects.get(id=body['original_workout_id'])
            workout = Workout(
                title=original_workout.title,
                description=original_workout.description,
                isPublic=False,  # Copied workouts will be private by default
                user=req.user,
            )
            workout.save()

            for original_exercise in original_workout.exercises.all():
                Exercise.objects.create(workout=workout, name=original_exercise.name)

            workout_like = WorkoutLike(
                user=req.user,
                original_workout=original_workout,
                copied_workout=workout
            )
            workout_like.save()

        else:
            workout = Workout(
                title=body["title"],
                description=body["description"],
                isPublic=body["isPublic"],
                user=req.user
            )
            workout.save()

            for exercise_data in body["exercises"]:
                    Exercise.objects.create(workout=workout, name=exercise_data['name'])

        workout_dict = model_to_dict(workout, fields=["id", "title", "description", "isPublic"])
        workout_dict["exercises"] = list(workout.exercises.values("name"))
        return JsonResponse({"workout": workout_dict})

    
    workouts = []
    for workout in req.user.workout_set.all().prefetch_related('exercises'):
        workout_dict = model_to_dict(workout, fields=["id", "title", "description", "isPublic"])
        workout_dict["exercises"] = list(workout.exercises.values("name"))
        workouts.append(workout_dict)

    return JsonResponse({"workouts": workouts})

@login_required
def stats(req):
    if req.method == 'POST':
        body = json.loads(req.body)

        stats, created = Stats.objects.update_or_create(
            user=req.user,
            defaults={
                'height': body["height"],
                'weight': body["weight"],
                'age': body["age"],
                'maxBench': body["maxBench"],
                'maxSquat': body["maxSquat"],
                'maxDeadlift': body["maxDeadlift"],
            }
        )

        stats_dict = model_to_dict(stats, fields=["height", "weight", "age", "maxBench", "maxSquat", "maxDeadlift"])
        return JsonResponse({"stats": stats_dict})
    
    else:
        try:
            user_stats = Stats.objects.get(user=req.user)

            stats_dict = model_to_dict(user_stats, fields=["height", "weight", "age", "maxBench", "maxSquat", "maxDeadlift"])
            return JsonResponse({"stats": stats_dict})

        except Stats.DoesNotExist:
            empty_stats_dict = {
                "height": None,
                "weight": None,
                "age": None,
                "maxBench": None,
                "maxSquat": None,
                "maxDeadlift": None
            }
            return JsonResponse({"stats": empty_stats_dict})

@login_required
def publicWorkouts(req):
    try:
        if req.method == "GET":
            public_workout = Workout.objects.filter(isPublic=True).prefetch_related('exercises')
            workouts_data = []
            for workout in public_workout:
                workout_dict = model_to_dict(workout, fields=["id", "title", "description", "isPublic"])
                workout_dict['exercises'] = list(workout.exercises.values("name"))
                workout_dict['like_count'] = WorkoutLike.objects.filter(original_workout=workout).count()
                workout_dict['is_liked'] = WorkoutLike.objects.filter(original_workout=workout, user=req.user).exists()
                workouts_data.append(workout_dict)

            return JsonResponse({"workouts": workouts_data})
    except Exception as e:
        print("Error in publicWorkouts view: ", str(e))
        return HttpResponseServerError("Internal Server Error")
    
@login_required
def delete_workout(req, workout_id):
    try:
        workout = Workout.objects.get(id=workout_id)
        workout.delete()
        return JsonResponse({'workout': 'success'})
    except Workout.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Workout not found'}, status=404)

@login_required
def view_workout(req, workout_id):
    try:
        workout = Workout.objects.get(id=workout_id) 
        workout_dict = model_to_dict(workout, fields=["id", "title", "description", "isPublic"])
        workout_dict['exercises'] = list(workout.exercises.values("name")) 
        return JsonResponse({'workout': workout_dict})
    except Workout.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Workout not found'}, status=404)
