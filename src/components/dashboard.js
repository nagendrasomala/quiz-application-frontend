// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //const response = await axios.get(`http://localhost:4000/user/get/${location.state.id}`);
        const response = await axios.get(`https://quizy-ggoe.onrender.com/user/get/${location.state.id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleStartQuiz = async () => {
    try{
        
        //await axios.post(`http://localhost:4000/user/quiz/${location.state.id}`);
        if(userData.startTime===""){
          await axios.post(`https://quizy-ggoe.onrender.com/user/quiz/${location.state.id}`);
          navigate('/quizpage',{state: {id : location.state.id }});
        }
        else{
          toast.success("Quiz completed already!!!");
        }

    
    } catch (error) {
        console.error('Error starting quiz:', error);
  }
  };

 
    
 

  return (
    <div className="min-h-screen bg-zinc-900">
        <nav className="bg-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-white md:text-2xl text-xl xl:text-3xl"> welcome, {userData?.name}</p>
        </div>
        <div>
        <Link to="/leaderboard" className='nav-link mt-4'> 
            <button
                className="bg-orange-500 text-white hover:bg-orange-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-64 mt-4">
                Leaderboard
              </button>
            </Link>
        </div>
      </nav>
      
      <div className="xl:p-8 mt-10 p-4 ">
      <div className="card shadow-2xl h-1/2 w-full bg-zinc-800 p-4 xl:p-10 rounded-md">
        <div className="form-container p-6 flex flex-col xl:flex-row justify-between ">
          {userData ? (
            <>
            <div>
              <p className=" text-white xl:text-3xl text-2xl">Java Quiz</p><br/>
              <p className=" text-white xl:text-2xl text-xl">Our Java Quiz is the perfect opportunity to put your knowledge to the test!</p>
              </div>
              <div className="flex flex-col justify-end">
              <button
                className="bg-orange-500 text-white hover:bg-orange-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-64 mt-4"
                onClick={handleStartQuiz}
              >
                Start Quiz
              </button>
              </div>
            </>
          ) : (
            <p className="text-white">Loading user data...</p>
          )}
        </div>
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Dashboard;
