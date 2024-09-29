import React, { useRef } from "react";
import { Link} from "react-router-dom";
import useSignup from "../hooks/useSignUp";

const SignUp = () => {
  const nameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const {loading,signup} = useSignup()
  const handleSubmit = async (e) => {
    e.preventDefault();
    let input = {
      name: nameRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
      password: passwordRef.current.value,
    };
    await signup(input);
    nameRef.current.value = "";
    phoneNumberRef.current.value = "";
    passwordRef.current.value = "";
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name </span>
              </label>
              <input
                type="text"
                placeholder="John"
                className="input input-bordered"
                required
                ref={nameRef}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mobile Number</span>
              </label>
              <input
                type="text"
                placeholder="xxxxxxxxxx"
                className="input input-bordered"
                required
                ref={phoneNumberRef}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
                ref={passwordRef}
              />
            </div>
            <div className="form-control mt-6 " type="submit">
              <button className="btn btn-primary">Sign Up</button>
            </div>
            <div className="text-center">
              New to here?{" "}
              <Link to={"/login"} className="text-blue-600">
                Sign In
              </Link>
            </div>
            <div onClick={()=>localStorage.clear()}>logout</div>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default SignUp;