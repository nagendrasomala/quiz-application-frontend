import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './quizpage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [marks, setMarks] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [userdata, setuserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Define the timeStringToSeconds function
  const timeStringToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Fetch quiz questions
        //const response = await axios.get(`http://localhost:4000/user/get/${location.state.id}`);
        const response = await axios.get(`https://quizy-ggoe.onrender.com/user/get/${location.state.id}`);
        setuserData(response.data.endTime);
        //const quizResponse = await axios.get('http://localhost:4000/questions/get');
        const quizResponse = await axios.get('https://quizy-ggoe.onrender.com/questions/get');
        if(response.data.endTime === ""){
            setQuizzes(quizResponse.data);
        }
        else{
            toast.success('Quiz completed already!!!');
        }
        
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleOptionClick = (quizId, questionId, optionIndex) => {
    setSelectedOptions((prevOptions) => {
      const key = `${quizId}-${questionId}`;
      return { ...prevOptions, [key]: optionIndex };
    });
  };

  const calculateMarks = async () => {
    try {
      // Update end time
      //const endTimeResponse = await axios.post(`http://localhost:4000/user/et/${location.state.id}`);
      const endTimeResponse = await axios.post(`https://quizy-ggoe.onrender.com/user/et/${location.state.id}`);

      // Fetch user data after updating end time
      //const userDataResponse = await axios.get(`http://localhost:4000/user/get/${location.state.id}`);
      const userDataResponse = await axios.get(`https://quizy-ggoe.onrender.com/user/get/${location.state.id}`);

      // Set start and end time
      setStartTime(userDataResponse.data.startTime);
      setEndTime(userDataResponse.data.endTime);

      // Calculate marks
      let newMarks = 0;

      quizzes.forEach((quiz) => {
        quiz.questions.forEach((question) => {
          const key = `${quiz._id}-${question._id}`;
          const selectedOptionIndex = selectedOptions[key];
          const isOptionCorrect = question.correctAnswer === question.options[selectedOptionIndex];

          if (isOptionCorrect) {
            newMarks += 1;
          }
        });
      });

      setMarks(newMarks);
      toast.success('Quiz Saved Successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  };

const handleSubmitQuiz = async () => {
  try {
    // Calculate marks and score
    const score = calculateMarksAndScore();

    // Prepare data to send to the backend
    const quizData = {
      student: userId,
      name: usernames,
      startTime: startTime,
      endTime: endTime,
      marks: marks, // Use the marks state here
      score: finalScore, // Use the finalScore state here
      // Add any other relevant data you need to send to the backend
    };

    // Submit quiz data to the backend
    const response = await axios.post(`http://localhost:4000/q/submit-quiz/${quizCode}`, quizData);
    
    // Handle the response from the backend if needed
    console.log('Quiz submitted successfully:', response.data);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    // Handle the error if needed
  }
};

  

  return (
    <div className="min-h-screen bg-zinc-900 p-2 pb-20 relative">
      {quizzes.map((quiz) => (
        <div className=" mt-3  flex flex-col items-center " key={quiz._id}>
          <h2 className="text-white text-3xl">{quiz.title}</h2>
          {quiz.questions.map((question) => (
            <div className="card  shadow-md shadow-zinc-700 mt-10 bg-zinc-700  p-5  justify-start flex flex-col w-full xl:w-2/3 text-white items-start" key={question._id}>
              <h3>{question.text}</h3>
              <ul>
                {question.options.map((option, index) => (
                  <div className="flex flex-col items-start justify-start" key={index}>
                    <li>
                      <input
                        type="radio"
                        id={`${quiz._id}-${question._id}-${index}`}
                        name={`${quiz._id}-${question._id}`}
                        checked={selectedOptions[`${quiz._id}-${question._id}`] === index}
                        onChange={() => handleOptionClick(quiz._id, question._id, index)}
                      />
                      <label
                        className="ml-4 cursor-pointer justify-start items-start"
                        htmlFor={`${quiz._id}-${question._id}-${index}`}
                      >
                        {option}
                      </label>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      {!userdata &&
      <button onClick={calculateMarks} className="mt-5 p-3 bg-blue-500 text-white rounded cursor-pointer">
        Save
      </button>
}
      {/* Submit Quiz Button */}
      {!userdata &&
      <button onClick={handleSubmitQuiz} className="absolute bottom-4 right-4 p-3 mt-10 bg-green-500 text-white rounded cursor-pointer">
        Submit Quiz
      </button>
}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default QuizPage;
