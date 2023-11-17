import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';

const SigninStudent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin123') {
      navigate('/add123');
    } else {
      toast.error("Credentials Incorrect !!!")
      console.log('Authentication failed');
    }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-6">
      <div className="card shadow-2xl h-1/2 md:w-1/2 xl:w-1/3 bg-zinc-800 rounded-md">
        <div className="form-container p-6">
          <h2 className="text-white text-xl mb-8">Signin </h2>
          <form onSubmit={handleSignin}>
            <input
              className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-5 bg-zinc-600 text-white"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-5 bg-zinc-600 text-white"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            
            <button
              className="bg-orange-500 text-white hover:bg-orange-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-64"
              onClick={handleSignin}
            >
              Sign In
            </button>
            
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default SigninStudent;
