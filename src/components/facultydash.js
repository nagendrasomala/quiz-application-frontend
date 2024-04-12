// FacultyDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FacultyDashboard = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  console.log(location.state.id)
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = location.state?.id;
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/q/fall/${userId}`); 
        //const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/fall/${userId}`);
        setQuizzes(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleViewAttempts = async (quizId,quizname) => {
      navigate('/viewdata',{ state: { id: quizId,name:quizname } })
  };


  const handleClick = () => {
    const facultyId = location.state?.id;
    console.log(facultyId + " in faculty dashboard");
    if (facultyId) {
      navigate('/createquiz', { state: { id: facultyId } });
    } else {
      console.error("Faculty ID is null or undefined");
      // Handle the case where faculty ID is null or undefined, such as showing an error message
    }
  };
  


  return (
    <div className="min-h-screen bg-zinc-900">
      <nav className="bg-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-white md:text-2xl text-xl xl:text-3xl">Faculty Dashboard</p>
        </div>
        <div>
        
            <button onClick={handleClick} className="bg-green-500 text-white hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-64 mt-4">
              Create Quiz
            </button>
          
        </div>
      </nav>

      <div className="xl:p-8 mt-10 p-1 ">
        <div className="flex flex-wrap justify-center">
          {isLoading ? (
            <p className="text-white">Loading quizzes...</p>
          ) : (
            quizzes.map(quiz => (
              <div key={quiz._id} className="card shadow-2xl h-1/2 w-full xl:w-5/6 full flex flex-col   bg-zinc-800 p-4 xl:p-4 rounded-md m-4">
                <div className='flex flex-col xl:flex-row justify-between '>
                <div className='  flex flex-col justify-between items-start  '>
                <p className="text-white xl:text-3xl text-xl  ">{quiz.quizName}</p>
                <p className="text-white xl:text-xl text-sm mt-2   ">{quiz.description}</p>
                </div>
                <div className='  flex flex-col justify-start items-start '>
                <p className="text-white xl:text-2xl text-sm mt-2  ">Code : {quiz.quizCode}</p>
                <p className="text-white xl:text-2xl text-sm mt-2 ">Date : {new Date(quiz.date).toLocaleDateString()}</p>
                </div>
                </div>
                <div className='flex flex-row justify-end'>
                <button
                  className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full xl:w-1/5 md:w-48 mt-4"
                  onClick={() => handleViewAttempts(quiz._id,quiz.quizName)}
                >
                  View Participants
                </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default FacultyDashboard;
