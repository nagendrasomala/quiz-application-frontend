import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [quizcode, setCode] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [participatedQuizzes, setParticipatedQuizzes] = useState([]);
  const usersId = location.state.id;
  const usernames = location.state.name;

  useEffect(() => {
    fetchParticipatedQuizzes();
  }, []);

  const fetchParticipatedQuizzes = async () => {
    try {
      const userId = usersId;
      const response = await axios.get(`http://localhost:4000/q/sall/${userId}`);
      //const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/sall/${userId}`);
      const quizzesData = response.data;
      setParticipatedQuizzes(quizzesData);
    } catch (error) {
      console.error('Error fetching participated quizzes:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleStartQuiz(usersId, quizcode);
    } catch (error) {
      console.error('Error handling quiz submission:', error);
    }
  };
  

  const handlefunction = async (responses) => {
   
    try {
      if (responses) {
        toast.warning('You have already taken the quiz.');
      } else {
        navigate('/quizpage', { state: { code: quizcode, id: usersId, name: usernames } });
      }
    } catch (error) {
      console.error('Error handling quiz submission:', error);
    }
  };

  const handleStartQuiz = async (userId, quizCode) => {
    // Data for creating a participant
    const participantData = {
      student: userId,
      name: usernames,
      startTime: '',
      endTime: '',
      marks: '',
      score: '',
      tabswitch: 2, // Assuming tabswitch value is hardcoded as 2 for new participants
    };
  
    try {
      await axios.post(`http://localhost:4000/q/pcreate/${quizCode}`, participantData);
      //await axios.post(`https://quiz-application-backend-39mn.onrender.com/q/pcreate/${quizCode}`, participantData);
  
      
      const response = await axios.get(`http://localhost:4000/q/gets/${quizCode}/${userId}`);
      //const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/gets/${quizCode}/${userId}`);
      const isParticipant = response.data.isParticipant;
  
      if (isParticipant) {
        toast.warning('You have already taken the quiz.');
      } else {
        // Navigate to the quiz page if the user is not already a participant
        navigate('/quizpage', { state: { code: quizcode, id: usersId, name: usernames } });
      }
    } catch (error) {
      // Handle errors
      toast.warning('You have already taken the quiz.');

      console.error('Error starting the quiz:', error);
    }
  };
  

  

  return (
    <div className="min-h-screen bg-zinc-900">
      <nav className="bg-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-white md:text-2xl text-xl xl:text-3xl">Welcome, {usernames}</p>
        </div>
        <div className='flex flex-row justify-end xl:justify-between w-full xl:w-4/12'> 
          <form onSubmit={handleSubmit} className='flex flex-row justify-end  xl:justify-around w-full'>
            <input
              className=" w-2/5 xl:w-3/6 xl:h-10 md:h-8  rounded-md p-4 bg-zinc-600 text-white"
              onChange={(event) => setCode(event.target.value)}
              type="text"
              placeholder="Quiz Code"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline   w-2/5 xl:w-2/6"
            >
              Take Quiz
            </button>
          </form>
        </div>
      </nav>
      
      <div className="xl:p-8 mt-10  flex  justify-center">
        <div className="  h-1/2 w-11/12  flex flex-col  justify-center rounded-md">
          
            {participatedQuizzes.length > 0 ? (
              participatedQuizzes.map((quiz, index) => (
                <div key={quiz._id} className=" h-1/2 w-11/12 full flex flex-col  justify-center   bg-zinc-800 p-2 xl:p-4 rounded-md m-4">
                <div className='flex xl:flex-row flex-col justify-between '>
                <div className=' flex flex-col justify-start items-start '>
                <p className="text-white xl:text-3xl text-xl  ">Name : {quiz.quizName}</p>
                <p className="text-white xl:text-xl text-sm mt-2  ">Desc : {quiz.description}</p>
                </div>
                <div className=' flex flex-col justify-start items-start '>
                <p className="text-white xl:text-2xl text-sm mt-2  ">Marks : {quiz.marks}</p>
                <p className="text-white xl:text-2xl text-sm mt-2  ">Date : {new Date(quiz.date).toLocaleDateString()}</p>
                </div>
                </div>
                
              </div>
              ))
            ) : (
              <p className="text-white">No quizzes participated yet.</p>
            )}
          
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Dashboard;