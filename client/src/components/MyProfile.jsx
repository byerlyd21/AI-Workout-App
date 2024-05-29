import { useUser } from '../App.jsx';
import React, { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
    const { user, loading } = useUser();
    const [ stats, setStats] = useState();
    const navigate = useNavigate();

    async function getStats() {
        const res = await fetch("/stats/",  {
            credentials: "same-origin",
        })

        const body = await res.json();
        setStats(body.stats)
    }

    async function editStats() {
        navigate('/editProfile', { state: { stats } });
    }

    useEffect(() => {
        if (user && stats === undefined) {
            getStats();
        }
    }, [user]);
    
    useEffect(() => {
        if (user && !loading && stats !== undefined && Object.values(stats).every(x => x === null)) {
            navigate('/editProfile');
        }
    }, [user, loading, stats, navigate]); 


    return  (
        <div className='page'>   
            {loading && <div>Loading ...</div>}
            <h1> Profile Page </h1>
            <div className='workout-cell'>
                <div className='workout-title'>
                    {user && <h3>{user.first_name} {user.last_name}</h3>}
                    <button className='delete-btn' onClick={() => editStats()}>Edit</button>
                </div>
                {stats && (
                    <div className='user-stats'>
                        <div className='stat-item' data-label="Height:">{stats.height}</div>
                        <div className='stat-item' data-label="Weight:">{stats.weight}</div>
                        <div className='stat-item' data-label="Age:">{stats.age}</div>
                        <div className='stat-item' data-label="Max Bench:">{stats.maxBench}</div>
                        <div className='stat-item' data-label="Max Squat:">{stats.maxSquat}</div>
                        <div className='stat-item' data-label="Max Deadlift:">{stats.maxDeadlift}</div>
                    </div>
                )}
            </div> 
        </div>
    )
}