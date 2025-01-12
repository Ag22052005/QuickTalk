import React, { useEffect } from "react";
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
import SelectAvatar from "./assets/screen/SelectAvatar.jsx";

const App = () => {

  // Move useAuthContext here
  const { authUser } = useAuthContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: authUser ? <Home /> : <Navigate to={"/login"} />,
    },
    // {
    //   path:"/select-avatar",
    //   element:<SelectAvatar/>
    // },
    {
      path: "/login",
      element: authUser ? <Navigate to={"/"} /> : <SignIn />,
    },
    {
      path: "/signup",
      element: authUser ? <Navigate to={"/"} /> : <SignUp />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
