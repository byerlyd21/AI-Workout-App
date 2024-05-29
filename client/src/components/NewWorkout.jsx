import cookie from "cookie"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function NewWorkout() {
    const [title, setTitle] = useState("");
    const [exercises, setExercises] = useState([{ name: '' }]);
    const [description, setDescription] = useState("");
    const [isPublic, setPublic] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const  navigate = useNavigate();


    const addExercise = () => {
        setExercises([...exercises, { name: '' }]);
    };

    const handleExerciseChange = (index, event) => {
        const newExercises = exercises.map((exercise, i) => {
            if (i === index) {
                return { ...exercise, name: event.target.value };
            }
            return exercise;
        });
        setExercises(newExercises);
    };

    async function createWorkout(e) {
        e.preventDefault();
        const result = await fetch("/workouts/", {
            method: "post",
            credentials: "same-origin",
            body: JSON.stringify({
                title, 
                exercises,
                description,
                isPublic
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            }
        })
        const body = await result.json();
        setWorkouts([...workouts, body.workout]);
        navigate(-1);
    }

    return  (
        <div>
            <h1> New Workout </h1>
            <div className="form-container">
                <form onSubmit={createWorkout} className="new-workout-form"> 
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"></input>
                    {exercises.map((exercise, index) => (
                        <input
                            key={index}
                            type="text"
                            value={exercise.name}
                            onChange={e => handleExerciseChange(index, e)}
                            placeholder="Exercise"
                        />
                    ))}
                    <button type="button" onClick={addExercise}>Add Exercise</button>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"></input>
                    <label className="check-box">
                        Public <input type="checkbox" checked={isPublic} onChange={e => setPublic(e.target.checked)} ></input>
                    </label>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    )
}