import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

  const Landingpage = () => {
  const navigate = useNavigate();
  const [isSignInFormOpen, setSignInFormOpen] = useState(false);
  const [isSignUpFormOpen, setSignUpFormOpen] = useState(true);
  const [issignIn, setIssignIn] = useState(true);


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
      const response = await axios.post('http://localhost:4000/s/sregister', {
      //const response = await axios.post('https://quiz-application-backend-39mn.onrender.com/s/sregister', {
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
      const response = await axios.post('http://localhost:4000/s/slogin', {
      //const response = await axios.post('https://quiz-application-backend-39mn.onrender.com/s/slogin', {
        email: emailSignIn,
        password: passwordSignIn,
      });

      // Handle the response
      if (response.data.success) {
        // Sign-in successful
        console.log(response.data)
        toast.success('Sign-in successful!');
        const userId = response.data.id;
        console.log(userId+" it is in landing page")
        const usernames = response.data.username;
        console.log(usernames+" it is in landing page")
        navigate('/dashboard',{state: {id : userId,name: usernames}});
        
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

  const handleSignInSignUp = () => {
    if (issignIn) {
      openSignInForm();
      setIssignIn(!issignIn);
    } else {
      openSignUpForm();
      setIssignIn(!issignIn);
    }
  };
  

  return (
    <div className="bg-zinc-00 min-h-screen">
      <nav className="bg-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-white md:text-2xl text-xl xl:text-3xl"> welcome to Quizy</p>
        </div>
        <div className='flex flex-row justify-between'>

        <button
          onClick={handleSignInSignUp}
          className={`bg-slate-500 text-white hover:bg-slate-700 px-4 py-2 rounded focus:outline-none focus:shadow-outline ${
            isSignInFormOpen || !issignIn ? 'bg-zinc-900' : ''
          }`}
        >
          {issignIn ? 'Sign In' : 'Sign Up'}
        </button>

        <Link to="/faculty">
          <button className="bg-green-500 text-white hover:bg-green-700 px-4 py-2 rounded focus:outline-none focus:shadow-outline">Faculty</button>
        </Link>
        </div>
        
      </nav>
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-6">
        <div className="card shadow-2xl rounded-xl h-1/2 md:w-1/2 xl:w-1/3 bg-zinc-800">
          <div className="w-full">
            
          </div>
          <div className="form-container p-6 ">
            {isSignInFormOpen && (
              <div className="form sign-in-form">
                <h2 className="text-white xl:text-2xl text-xl mb-8">SignIn To Take Quiz</h2>
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
                <h2 className="text-white xl:text-2xl text-xl mb-8">SignUp For Your Quiz</h2>
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </div>
  );
};

export default Landingpage;
