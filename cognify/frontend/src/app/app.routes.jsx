import { createBrowserRouter } from "react-router";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";
import Verify from "../feature/auth/pages/Verify";
import Dashboard from "../feature/chat/pages/Dashboard";
import Protected from "../feature/auth/components/Protected";

export const routes = createBrowserRouter([
    {
        path : '/register',
        element : <Register />
    },
    {
       path : '/login',
       element : <Login/>
    },
    {
     path : "/verify",
     element : <Verify/>
    },
     {
    path: "/dashboard",
    element: <Protected><Dashboard /></Protected>,

      
    
  }
])