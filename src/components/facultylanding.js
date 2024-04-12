import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

  const FacultyLandingpage = () => {
  const navigate = useNavigate();
  const [isSignInFormOpen, setSignInFormOpen] = useState(false);
  const [isSignUpFormOpen, setSignUpFormOpen] = useState(true);

  // Sign-up state variables
  const [username, setUsername] = useState('');
  const [emailSignUp, setEmailSignUp] = useState('');
  const [passwordSignUp, setPasswordSignUp] = useState('');

  // Sign-in state variables
  const [emailSignIn, setEmailSignIn] = useState('');
  const [passwordSignIn, setPasswordSignIn] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/f/fregister', {
      //const response = await axios.post('https://quiz-application-backend-39mn.onrender.com/f/fregister', {
        name: username,
        email: emailSignUp,
        password: passwordSignUp,
      });

      // Handle the response
      if (response) {
        // Registration successful
        toast.success('Registration successful! Please sign in.');
        setSignInFormOpen(true);
        setSignUpFormOpen(false);
      } else {
        // Registration failed
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/f/flogin', {          
      //const response = await axios.post('https://quiz-application-backend-39mn.onrender.com/f/flogin', { 
        email: emailSignIn,
        password: passwordSignIn,
      });

      // Handle the response
      if (response.data.success) {
        // Sign-in successful
        toast.success('Sign-in successful!');
        const userId = response.data.id;
        console.log(userId)
        navigate('/facultydashboard',{state: {id : userId }});
        
        // Example: history.push(`/next-page/${userId}`);
      } else {
        // Sign-in failed
        toast.error('Sign-in failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const openSignInForm = () => {
    setSignInFormOpen(true);
    setSignUpFormOpen(false);
  };

  const openSignUpForm = () => {
    setSignUpFormOpen(true);
    setSignInFormOpen(false);
  };

  return (
    <div className="bg-zinc-900 min-h-screen">
        <nav className="bg-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-white md:text-2xl text-xl xl:text-3xl"> welcome to Quizy</p>
        </div>
        
       
      </nav>
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-6">
    <div className="card shadow-2xl h-1/2 md:w-1/2 xl:w-1/3 bg-zinc-800">
        <h1 className='text-2xl text-white'>Faculty Page</h1>
      <div className="w-full">
        <button
          onClick={openSignInForm}
          className={`active:bg-zinc-900 h-14 w-1/2 h border-2 text-white border-zinc-900 text-center xl:text-2xl md:text-xl ${isSignInFormOpen ? 'bg-zinc-900' : ''}`}
        >
          Sign In
        </button>
        <button
          onClick={openSignUpForm}
          className={`active:bg-zinc-900 h-14 w-1/2 border-2 text-white border-zinc-900 text-center xl:text-2xl md:text-xl ${isSignUpFormOpen ? 'bg-zinc-900' : ''}`}
        >
          Sign Up
        </button>
      </div>
      <div className="form-container p-6 ">
        {isSignInFormOpen && (
          <div className="form sign-in-form">
            <h2 className="text-white text-md mb-8">Sign In</h2>
            <form onSubmit={handleSignIn}>
              <input
                className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white"
                onChange={(event) => setEmailSignIn(event.target.value)}
                type="email"
                placeholder="Email"
              />
              <input
                className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white"
                onChange={(event) => setPasswordSignIn(event.target.value)}
                type="password"
                placeholder="Password"
              />
              <button className="bg-green-500 text-white hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-64">
                Sign In
              </button>
            </form>
          </div>
        )}
        {isSignUpFormOpen && (
          <div className="form sign-up-form">
            <h2 className="text-white text-md mb-8">Sign Up</h2>
            <form onSubmit={handleSignUp}>
              <input
                className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white"
                onChange={(event) => setUsername(event.target.value)}
                type="text"
                placeholder="Username"
              />
              <input
                className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white"
                onChange={(event) => setEmailSignUp(event.target.value)}
                type="email"
                placeholder="Email"
              />
              <input
                className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white"
                onChange={(event) => setPasswordSignUp(event.target.value)}
                type="password"
                placeholder="Password"
              />
              
              <button className="bg-green-500 text-white hover:bg-green-700 mt-10 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-64">
                Sign Up
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default FacultyLandingpage;
