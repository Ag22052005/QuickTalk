import React, { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./components/shared/SignUp"; 
import SignIn from "./components/shared/SignIn"; 
import Home from "./screen/Home";
import { useAuthContext } from "./context/AuthContext";
import Profile from "./screen/Profile"; 
import VideoCallPage from "./screen/VideoCallPage"; 
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
