import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cookie from "cookie";

export default function PublicWorkouts() {
    const [workouts, setWorkouts] = useState([]);
    const [likedWorkouts, setLikedWorkouts] = useState(new Set());

    async function getPublicWorkouts() {
        try {
            const res = await fetch("/publicWorkouts/", {
                credentials: "same-origin",
            });

            if (!res.ok) {
                throw new Error('Error fetching public workouts');
            }

            const body = await res.json();
            setWorkouts(body.workouts);
            const likedIds = new Set(body.workouts.filter(workout => workout.is_liked).map(workout => workout.id));
            setLikedWorkouts(likedIds);
        } catch (error) {
            console.error("Error in fetching public workouts:", error);
        }
    }

    async function handleLike(workoutId) {
        const isAlreadyLiked = likedWorkouts.has(workoutId);
        try {
            let success = false;
            if (!isAlreadyLiked) {
                // Like the workout if not already liked
                success = await likeWorkout(workoutId);
                if (success) {
                    setLikedWorkouts(prev => new Set(prev).add(workoutId));
                }
            } else {
                // The workout is already liked, unlike it
                success = await unlikeWorkout(workoutId);
                if (success) {
                    setLikedWorkouts(prev => {
                        const updatedLikes = new Set(prev);
                        updatedLikes.delete(workoutId);
                        return updatedLikes;
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    async function likeWorkout(workoutId) {
        try {
            // Copy the workout first
            const copyRes = await fetch(`/workouts/`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                },
                body: JSON.stringify({ original_workout_id: workoutId })
            });
    
            if (!copyRes.ok) {
                console.error('Failed to copy the workout');
                return false;
            }
            
            const copyResBody = await copyRes.json();
            const copiedWorkoutId = copyResBody.workout.id; // Assuming the server returns the ID of the copied workout
            console.log('Workout successfully copied');
    
            return true;
    
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
    
    async function unlikeWorkout(workoutId) {
        try {
            const res = await fetch(`/unlike_workout/${workoutId}/`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                }
            });
    
            if (!res.ok) {
                console.error('Failed to unlike the workout');
                return false;
            }
    
            return true;
    
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    useEffect(() => {
        getPublicWorkouts();
    }, [])

    return (
        <div className='page'>
            <h1> Public Workouts </h1>
            {
                workouts.map(workout => (
                    <div className='workout-cell' key={workout.id}>
                        <div className='workout-title'>
                            <Link to={`/viewWorkout/${workout.id}`} className="workout-link">
                                {workout.title}
                            </Link>
                            <button 
                            className={`like-btn ${likedWorkouts.has(workout.id) ? 'liked' : ''}`} 
                            onClick={() => handleLike(workout.id)}
                            >
                                ♡
                            </button>
                        </div>
                        <div className='workout-content'>
                            {workout.exercises && workout.exercises.map((exercise, index) => (
                                <div key={index} className="exercise-item"> 
                                    • {exercise.name}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}
