import cookie from "cookie";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from '../App.jsx';

export default function EditProfile() {
    const location = useLocation();
    const stats = location.state?.stats;
    
    const [height, setHeight] = useState(stats?.height || "");
    const [weight, setWeight] = useState(stats?.weight || "");
    const [age, setAge] = useState(stats?.age || "");
    const [maxBench, setMaxBench] = useState(stats?.maxBench || "");
    const [maxSquat, setMaxSquat] = useState(stats?.maxSquat || "");
    const [maxDeadlift, setMaxDeadlift] = useState(stats?.maxDeadlift || "");
    const { user, loading } = useUser();
    const navigate = useNavigate();

    async function editStats(e) {
        e.preventDefault();
        const result = await fetch("/stats/", {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({
                height, 
                weight,
                age,
                maxBench,
                maxSquat,
                maxDeadlift,
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            }
        });

        if (result.ok) {
            navigate("/myProfile");
        } else {
            console.error('Failed to edit stats'); 
        }
    }

    return (
        <div>
            {user && <h1>{user.first_name} {user.last_name}</h1>}
            <div className="form-container">
                <form onSubmit={editStats} className="edit-profile-form">
                    <input type="text" value={height} onChange={e => setHeight(e.target.value)} placeholder="Height" />
                    <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight" />
                    <input type="text" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
                    <input type="text" value={maxBench} onChange={e => setMaxBench(e.target.value)} placeholder="Max Bench" />
                    <input type="text" value={maxSquat} onChange={e => setMaxSquat(e.target.value)} placeholder="Max Squat" />
                    <input type="text" value={maxDeadlift} onChange={e => setMaxDeadlift(e.target.value)} placeholder="Max Deadlift" />
                    <button type="submit" className="btn">Save</button>
                </form>
            </div>
        </div>
    )
}
