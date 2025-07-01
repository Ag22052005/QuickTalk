import React, { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import SignUp from "./assets/components/SignUp";
import SignIn from "./assets/components/SignIn";
import Home from "./assets/screen/Home";
import  { useAuthContext } from "./context/AuthContext.jsx";
import Profile from "./assets/screen/Profile.jsx";
import VideoCallPage  from "./assets/screen/VideoCallPage.jsx";

const App = () => {
  const { authUser } = useAuthContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: authUser ? <Home /> : <Navigate to={"/login"} />,
    },
    {
      path: "/login",
      element: authUser ? <Navigate to={"/"} /> : <SignIn />,
    },
    {
      path: "/signup",
      element: authUser ? <Navigate to={"/"} /> : <SignUp />,
    },
    {
      path:"/profile",
      element:authUser ? <Profile/>  : <Navigate to={"/"}/>,
    },
    {
      path:'/video-call/:roomId',
      element:authUser ? <VideoCallPage/> : <Navigate to={"/"}/>,
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
