import { Link } from 'react-router-dom';
import React, { useState, useEffect, } from 'react';
import { useUser } from '../App.jsx';
import '../App.css'
import cookie from "cookie"
import { useNavigate } from 'react-router-dom';

export default function MyWorkouts() {
    const { user } = useUser();
    const [workouts, setWorkouts] = useState([]);
    const navigate = useNavigate();

    async function getworkouts() {
        const res = await fetch("/workouts/",  {
            credentials: "same-origin",
        })

        const body = await res.json();
        setWorkouts(body.workouts)
    }
    
    async function handleDelete(workoutId) {
        try {
            const res = await fetch(`/deleteWorkout/${workoutId}`, { 
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                }
            });
            if (res.ok) {
                setWorkouts(workouts.filter(workout => workout.id !== workoutId));
            } else {
                console.error('Failed to delete the workout');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function newWorkout() {
        navigate('/newWorkout');
    }

    useEffect(() => {
        if (user) {
            getworkouts();
        }
    }, [user])

    return  (
        <div className='page'>
            <h1> My Workouts </h1>
            {
                workouts.map(workout => (
                    <div className='workout-cell' key={workout.id}>
                        <div className='workout-title'>
                            <Link to={`/viewWorkout/${workout.id}`} className="workout-link">{workout.title}</Link>
                            <button className='delete-btn' onClick={() => handleDelete(workout.id)}>x</button>
                        </div>
                        <div className='workout-content'>
                            {workout.exercises && workout.exercises.map((exercise, index) => (
                                <div key={index} className="exercise-item"> 
                                    • {exercise.name}
                                </div>
                            ))}
                        </div>
                    </ div>
                ))
            }
            <button className='btn' onClick={() => newWorkout()}>New Workout</button>
        </div>
    )
}