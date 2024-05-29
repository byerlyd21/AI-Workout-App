import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './App.css';

export const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

function App() {
  const[user, setUser] = useState(null);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch('/me/', { credentials: "same-origin" });
        const body = await res.json();
        setUser(body.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }

  return (
    <UserContext.Provider value={{ user, loading }} >
      <div className="appContainer">
        <div className='nav-bar'></div>
        <nav className='navTab'>
          <Link to="/" className='navBtn'>My Workouts</Link>
          <Link to="/publicWorkouts" className='navBtn'>Public Workouts</Link>
          <Link to="/newWorkout" className='navBtn'>New Workout</Link>
          {/* <Link to="/newWorkoutAI" className='navBtn'>Generate With AI</Link> */}
          <Link to="/myProfile" className='navBtn'>My Profile</Link>
          <button className='navBtn' onClick={logout}>Logout</button>
        </nav>
        <div className='pageContent'>
          <Outlet />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
