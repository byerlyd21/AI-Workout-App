import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'vite/modulepreload-polyfill'
import  MyWorkouts from './components/MyWorkouts';
import  MyProfile  from './components/MyProfile';
import  EditProfile from './components/EditProfile';
import  NewWorkout  from './components/NewWorkout';
import  NewWorkoutAI  from './components/NewWorkoutAI';
import  PublicWorkouts  from './components/PublicWorkouts';
import  ViewWorkout  from './components/ViewWorkout';
import { 
  createHashRouter,
  RouterProvider
 } from 'react-router-dom'

 const router = createHashRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/", 
        element: <MyWorkouts></MyWorkouts>
      },
      {
        path: "/publicWorkouts",
        element: <PublicWorkouts></PublicWorkouts>
      },
      {
        path: "/newWorkout",
        element: <NewWorkout></NewWorkout>
      },
      {
        path: "/newWorkoutAI",
        element: <NewWorkoutAI></NewWorkoutAI>
      },
      {
        path: "/myProfile",
        element: <MyProfile></MyProfile>
      },
      {
        path: "editProfile",
        element: <EditProfile></EditProfile>
      },
      {
        path: "viewWorkout/:id",
        element: <ViewWorkout></ViewWorkout>
      },
      {
        path: "/myWorkouts",
        element: <MyWorkouts></MyWorkouts>
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}></RouterProvider>
)

