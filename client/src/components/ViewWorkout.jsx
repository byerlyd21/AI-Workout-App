import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";

export default function ViewWorkout() {
    const [workout, setWorkout] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    async function getWorkout() {
        try {
            const res = await fetch(`/viewWorkout/${id}`, {
                credentials: 'same-origin',
            });

            if (!res.ok) {
                throw new Error('Error fetching workout details');
            }

            const body = await res.json();
            setWorkout(body.workout);
        } catch (error) {
            console.error('Error in fetching workout:', error);
        }
    }

    useEffect(() => {
        getWorkout();
    }, [id]);

    if (!workout) {
        return <div>Loading...</div>;
    }

    return  (
        <div className='page'>
        <div className='workout-cell' key={workout.id}>
            <div className='workout-title'>
                <div className='workout-link'>{workout.title}</div>
                <button className='delete-btn' onClick={() => handleDelete(workout.id)}>x</button>
            </div>
            <div className='workout-content'>
                {workout.exercises && workout.exercises.map((exercise, index) => (
                    <div key={index} className='exercise-item'> 
                        • {exercise.name}
                    </div>
                ))}
            </div>
            <div className="workout-description">
                {workout.description}
            </div>
            <button className="btn" onClick= {()=> navigate(-1)}>Back</button>
        </ div>
    </div>
    )
}