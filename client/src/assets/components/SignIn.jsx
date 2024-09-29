import React, { useRef } from 'react'
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

const SignIn = () => {
  const {login,loader} = useLogin()
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let input = {
      password: passwordRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
    };
    await login(input)
    phoneNumberRef.current.value= ""
    passwordRef.current.value=""
    
  };
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
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
            <div className="form-control mt-6" type="submit">
              <button className="btn btn-primary" >Login</button>
            </div>
            <div className="text-center">Already an user? <Link to={'/signup'} className="text-blue-600">SignUp</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn