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
  const [finalScore, setFinalScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [quizDataLoaded, setQuizDataLoaded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCode, setQuizCode] = useState('');
  const [usernames, setUsernames] = useState('');
  const [userId, setUserId] = useState('');
  const [remainingTime, setRemainingTime] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { id: usersId, code: quizCode, name: usernames } = location.state;
  
      setUserId(usersId);
      setQuizCode(quizCode);
      setUsernames(usernames);
  
      try {
        const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/quizstart/${quizCode}`);
        if (response.data && response.data.questions) {
          setQuizzes([response.data]);
          setQuizDataLoaded(true);
  
          const storedStartTime = localStorage.getItem('quizStartTime');
          const storedDuration = localStorage.getItem('quizDuration');
          
          if (storedStartTime && storedDuration) {
            const startTime = new Date(storedStartTime);
            const duration = parseInt(storedDuration, 10);
  
            // Set start and end time based on stored values
            setStartTime(startTime);
            setEndTime(new Date(startTime.getTime() + duration * 60000));
          } else {
            const startTime = new Date();
            setStartTime(startTime);
            localStorage.setItem('quizStartTime', startTime);
            localStorage.setItem('quizDuration', response.data.duration);
            setEndTime(new Date(startTime.getTime() + response.data.duration * 60000));
          }
        } else {
          console.error('Quiz data is not in the expected format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };
  
    if (location.state && location.state.code && !quizDataLoaded) {
      fetchData();
    }
  }, [location.state, quizDataLoaded]);
  
  useEffect(() => {
    if (startTime && endTime) {
      const interval = setInterval(() => {
        const now = new Date();
        if (now >= endTime && !quizSubmitted) {
          clearInterval(interval);
          handleSubmitQuiz();
        } else {
          setRemainingTime(Math.floor((endTime - now) / 1000));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime, quizSubmitted]);
  
  

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && !quizSubmitted) {
        try {
          alert('Switching tabs during the quiz may lead to automatic submission.');
          const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/tabswitch/${quizCode}/${userId}`);
          const currentTabSwitchCount = response.data.tabSwitchCount;
          
          setTabSwitchCount(currentTabSwitchCount - 1);
          if (currentTabSwitchCount === 0) {
            handleSubmitQuiz();
          }
          updateTabSwitchCount(quizCode, currentTabSwitchCount - 1);
        } catch (error) {
          console.error('Error fetching tab switch count:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [quizCode, quizSubmitted]);

  const getTabSwitchCount = async (quizCode) => {
    try {
      const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/tabswitch/${quizCode}/${userId}`);
      setTabSwitchCount(response.data.tabSwitchCount);
    } catch (error) {
      console.error('Error getting tab switch count:', error);
    }
  };

  const updateTabSwitchCount = async (quizCode, tabSwitchCount) => {
    try {
      await axios.put(`https://quiz-application-backend-39mn.onrender.com/q/tab-switch-count/${quizCode}/${userId}`, { tabSwitchCount });
    } catch (error) {
      console.error('Error updating tab switch count:', error);
    }
  };



  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);

    const score = calculateMarksAndScore();
    if(marks==null || marks==0) {setMarks(0);}

    const quizData = {
      student: userId,
      name: usernames,
      startTime: startTime,
      endTime: endTime,
      marks: marks,
      score: finalScore,
      tabswitch: 2,
    };

    try {
      const response = await axios.post(`https://quiz-application-backend-39mn.onrender.com/q/submit-quiz/${quizCode}`, quizData);
      console.log('Quiz submitted successfully:', response.data);
      localStorage.removeItem('quizStartTime');
      localStorage.removeItem('quizDuration');
      navigate('/dashboard', { state: { id: userId, name: usernames } });
    } catch (error) {
      toast.error('Already Submitted Quiz!!!');
      console.error('Error submitting quiz:', error);
    }
  };

  const handleOptionClick = (quizId, questionId, optionIndex) => {
    setSelectedOptions((prevOptions) => {
      const key = `${quizId}-${questionId}`;
      return { ...prevOptions, [key]: optionIndex };
    });
  };

  const goToNextQuestion = () => {
    if (quizzes.length > 0 && currentQuestionIndex < quizzes[0].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateMarksAndScore = () => {
    let newMarks = 0;
    let totalQuestions = 0;

    quizzes.forEach((quiz) => {
      quiz.questions.forEach((question) => {
        const key = `${quiz._id}-${question._id}`;
        const selectedOptionIndex = selectedOptions[key];
        const isOptionCorrect = question.correctAnswer === question.options[selectedOptionIndex];

        if (isOptionCorrect) {
          newMarks += 1;
        }
        totalQuestions++; 
      });
    });

    const score = (newMarks / totalQuestions) * 100;

    setMarks(newMarks);
    setFinalScore(score);

    return score;
  };

  const handleSave = () => {
    calculateMarksAndScore();
    toast.success("Quiz Saved Successfully.")
  };

  const saveAndSubmitButtons = (
    <div className='flex flex-row  w-1/3 justify-between'>
      <button onClick={handleSave} className="p-3 bg-blue-500 text-white rounded cursor-pointer">
        Save
      </button>
      <button onClick={handleSubmitQuiz} className="p-3 bg-green-500 text-white rounded cursor-pointer">
        Submit
      </button>
    </div>
  );

  const timer = (
    <div className="text-white md:text-2xl text-xl xl:text-3xl">
      Time Left: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-900">
      <nav className="bg-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-white md:text-2xl text-xl xl:text-3xl">Take the Quiz</p>
        </div>
        <div>
          {timer}
        </div>
      </nav>
      <div className="xl:p-8  p-1 h-screen w-full  flex flex-col  ">
        <div className="xl:w-full h-4/5 flex flex-row justify-between ">
          <div className="bg-zinc-700 p-1  flex flex-col xl:flex-wrap xl:items-center   xl:p-4 rounded-xl  w-1/6">
            {quizDataLoaded &&
              quizzes.map((quiz, quizIndex) => (
                <div key={quizIndex} className='w-full overflow-y-scroll xl:overflow-hidden  flex flex-col xl:flex-wrap items-center '>
                  <h3 className="text-white text-xl mb-4">{quiz.title}</h3>
                  {quiz.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className={`w-2/4 xl:w-1/4 flex h-9 items-center justify-center mb-2 cursor-pointer ${currentQuestionIndex === questionIndex ? 'bg-green-500' : 'bg-zinc-600'}`}
                      onClick={() => setCurrentQuestionIndex(questionIndex)}
                    >
                      {questionIndex + 1}
                    </div>
                  ))}
                </div>
              ))}
          </div>
          <div className="bg-zinc-700 p-4 rounded-xl  overflow-y-scroll xl:w-4/6 w-full">
          {quizDataLoaded &&
              quizzes.map((quiz) => (
                <div className="xl:-mt-10 w-full flex flex-col items-center -mt-5   xl:h-96" key={quiz._id}>
                  <h2 className="text-white text-3xl">{quiz.title}</h2>
                  {quiz.questions.map((question, index) => (
                    <div
                      className={`card shadow-md   shadow-zinc-700 mt-4 xl:p-5 justify-start flex flex-col h-96 w-full xl:w-11/12 text-black items-start ${
                        index === currentQuestionIndex ? '' : 'hidden'
                      }`}
                      key={question._id}
                    >
                      <div  className="w-full h-22  xl:p-5 mt-3 ">
                        <div  className="w-full h-22   bg-zinc-400 p-5 rounded-lg overflow-clip  flex justify-start items-center">
                          <h3>{question.text}</h3>
                        </div>
                        <ul>
                          {question.options.map((option, optionIndex) => (
                            <div className="flex flex-col items-start justify-start" key={optionIndex}>
                              <div  className="w-full h-18  rounded-lg bg-zinc-400 overflow-y-scroll xl:overflow-hidden p-5 mt-3 flex justify-start items-center">
                                <li className=''>
                                  <input
                                  className=' '
                                    type="radio"
                                    id={`${quiz._id}-${question._id}-${optionIndex}`}
                                    name={`${quiz._id}-${question._id}`}
                                    checked={selectedOptions[`${quiz._id}-${question._id}`] === optionIndex}
                                    onChange={() => handleOptionClick(quiz._id, question._id, optionIndex)}
                                  />
                                  <label
                                    className="ml-4 overflow-x-scroll cursor-pointer justify-start items-start"
                                    htmlFor={`${quiz._id}-${question._id}-${optionIndex}`}
                                  >
                                    {option}
                                  </label>
                                </li>
                              </div>
                            </div>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-row justify-between w-full xl:w-full mt-4">
          <button onClick={goToPreviousQuestion} className="p-3 bg-zinc-500 text-white rounded cursor-pointer">
            Prev
          </button>
          {saveAndSubmitButtons}
          <button onClick={goToNextQuestion} className="p-3 bg-zinc-500 text-white rounded cursor-pointer">
            Next
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default QuizPage;



































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './quizpage.css';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuizPage = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [marks, setMarks] = useState(0);
//   const [finalScore, setFinalScore] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [quizDataLoaded, setQuizDataLoaded] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [quizCode, setQuizCode] = useState('');
//   const [usernames, setUsernames] = useState('');
//   const [userId, setUserId] = useState('');
//   const [remainingTime, setRemainingTime] = useState(null);
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [quizSubmitted, setQuizSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { id: usersId, code: quizCode, name: usernames } = location.state;

//       setUserId(usersId);
//       setQuizCode(quizCode);
//       setUsernames(usernames);

//       try {
//         //const response = await axios.get(`http://localhost:4000/q/quizstart/${quizCode}`);
//         const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/quizstart/${quizCode}`);
//         if (response.data && response.data.questions) {
//           setQuizzes([response.data]);
//           setQuizDataLoaded(true);
//           setStartTime(new Date());
//           setEndTime(new Date(Date.now() + response.data.duration * 60000));
//         } else {
//           console.error('Quiz data is not in the expected format:', response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching quiz data:', error);
//       }
//     };

//     if (location.state && location.state.code && !quizDataLoaded) {
//       fetchData();
//     }
//   }, [location.state, quizDataLoaded]);



  
//   useEffect(() => {
//     const handleVisibilityChange = async () => {
//       if (document.visibilityState === 'hidden' && !quizSubmitted) {
//         try {
//           alert('Switching tabs during the quiz may lead to automatic submission.');
//           //const response = await axios.get(`http://localhost:4000/q/tabswitch/${quizCode}/${userId}`);
//           const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/tabswitch/${quizCode}/${userId}`);
//           const currentTabSwitchCount = response.data.tabSwitchCount;
          
//           setTabSwitchCount(currentTabSwitchCount - 1);
//           if(currentTabSwitchCount==0){
//             handleSubmitQuiz();
//           }
//           updateTabSwitchCount(quizCode, currentTabSwitchCount - 1);
//         } catch (error) {
//           console.error('Error fetching tab switch count:', error);
//         }
//       }
//     };
    
    

//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [quizCode, quizSubmitted]);

//   const getTabSwitchCount = async (quizCode) => {
//     try {
//       //const response = await axios.get(`http://localhost:4000/q/tabswitch/${quizCode}/${userId}`);
//       const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/tabswitch/${quizCode}/${userId}`);
//       setTabSwitchCount(response.data.tabSwitchCount);
//     } catch (error) {
//       console.error('Error getting tab switch count:', error);
//     }
//   };

//   const updateTabSwitchCount = async (quizCode, tabSwitchCount) => {
//     try {
//       //await axios.put(`http://localhost:4000/q/tab-switch-count/${quizCode}/${userId}`, { tabSwitchCount });
//       await axios.put(`https://quiz-application-backend-39mn.onrender.comq/tab-switch-count/${quizCode}/${userId}`, { tabSwitchCount });
//     } catch (error) {
//       console.error('Error updating tab switch count:', error);
//     }
//   };

//   useEffect(() => {
//     if (startTime && endTime) {
//       const interval = setInterval(() => {
//         const now = new Date();
//         if (now >= endTime && !quizSubmitted) {
//           clearInterval(interval);
//           handleSubmitQuiz();
//         } else {
//           setRemainingTime(Math.floor((endTime - now) / 1000));
//         }
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [startTime, endTime, quizSubmitted]);

//   const handleSubmitQuiz = async () => {
//     setQuizSubmitted(true);

//     const score = calculateMarksAndScore();

//     const quizData = {
//       student: userId,
//       name: usernames,
//       startTime: startTime,
//       endTime: endTime,
//       marks: marks,
//       score: finalScore,
//       tabswitch:2,
//     };

//     try {
//       //const response = await axios.post(`http://localhost:4000/q/submit-quiz/${quizCode}`, quizData);
//       const response = await axios.post(`https://quiz-application-backend-39mn.onrender.com/q/submit-quiz/${quizCode}`, quizData);
//       console.log('Quiz submitted successfully:', response.data);
//       navigate('/dashboard', { state: { id: userId, name: usernames } });
//     } catch (error) {
//       toast.error('Already Submitted Quiz!!!');
//       console.error('Error submitting quiz:', error);
//     }
//   };

//   const handleOptionClick = (quizId, questionId, optionIndex) => {
//     setSelectedOptions((prevOptions) => {
//       const key = `${quizId}-${questionId}`;
//       return { ...prevOptions, [key]: optionIndex };
//     });
//   };

//   const goToNextQuestion = () => {
//     if (quizzes.length > 0 && currentQuestionIndex < quizzes[0].questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };


//   const goToPreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };





//   const calculateMarksAndScore = () => {
//     let newMarks = 0;
//     let totalQuestions = 0;

//     quizzes.forEach((quiz) => {
//       quiz.questions.forEach((question) => {
//         const key = `${quiz._id}-${question._id}`;
//         const selectedOptionIndex = selectedOptions[key];
//         const isOptionCorrect = question.correctAnswer === question.options[selectedOptionIndex];

//         if (isOptionCorrect) {
//           newMarks += 1;
//         }
//         totalQuestions++; 
//       });
//     });

//     const score = (newMarks / totalQuestions) * 100;

//     setMarks(newMarks);
//     setFinalScore(score);

//     return score;
//   };

//   const handleSave = () => {
//     calculateMarksAndScore();
//     toast.success("Quiz Saved Successfully.")
//   };

//   const saveAndSubmitButtons = (
//     <div className='flex flex-row  w-1/3 justify-between'>
//       <button onClick={handleSave} className=" p-3 bg-blue-500 text-white rounded cursor-pointer">
//         Save
//       </button>
//       <button onClick={handleSubmitQuiz} className="p-3 bg-green-500 text-white rounded cursor-pointer">
//         Submit
//       </button>
//     </div>
//   );

//   const timer = (
//     <div className="text-white md:text-2xl text-xl xl:text-3xl">
//       Time Left: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-zinc-900">
//       <nav className="bg-zinc-800 p-4 flex items-center justify-between">
//         <div className="flex items-center">
//           <p className="text-white md:text-2xl text-xl xl:text-3xl">Take the Quiz</p>
//         </div>
//         <div>
//           {timer}
//         </div>
//       </nav>
//       <div className="xl:p-8 mt-10 p-1 h-full w-full  flex flex-col justify-center items-center">
//         <div className="  p-2 w-full  xl:w-7/12 h-96 flex flex-col justify-between">
//           <div className='bg-zinc-700 p-4 rounded-xl '>
//             {quizDataLoaded &&
//               quizzes.map((quiz) => (
//                 <div className="xl:-mt-10 w-full flex flex-col items-center -mt-5  xl:h-96" key={quiz._id}>
//                   <h2 className="text-white text-3xl">{quiz.title}</h2>
//                   {quiz.questions.map((question, index) => (
//                     <div
//                       className={`card shadow-md shadow-zinc-700 mt-4 xl:p-5 justify-start flex flex-col h-96 w-full xl:w-11/12 text-black items-start ${
//                         index === currentQuestionIndex ? '' : 'hidden'
//                       }`}
//                       key={question._id}
//                     >
//                       <div  className="w-full h-full  xl:p-5 mt-3 ">
//                         <div  className="w-full h-20 bg-zinc-400 p-5 rounded-lg overflow-clip  flex justify-start items-center">
//                           <h3>{question.text}</h3>
//                         </div>
//                         <ul>
//                           {question.options.map((option, optionIndex) => (
//                             <div className="flex flex-col items-start justify-start" key={optionIndex}>
//                               <div  className="w-full h-5 rounded-lg bg-zinc-400 overflow-hidden p-5 mt-3 flex justify-start items-center">
//                                 <li className=''>
//                                   <input
//                                     type="radio"
//                                     id={`${quiz._id}-${question._id}-${optionIndex}`}
//                                     name={`${quiz._id}-${question._id}`}
//                                     checked={selectedOptions[`${quiz._id}-${question._id}`] === optionIndex}
//                                     onChange={() => handleOptionClick(quiz._id, question._id, optionIndex)}
//                                   />
//                                   <label
//                                     className="ml-4 cursor-pointer justify-start items-start"
//                                     htmlFor={`${quiz._id}-${question._id}-${optionIndex}`}
//                                   >
//                                     {option}
//                                   </label>
//                                 </li>
//                               </div>
//                             </div>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//           </div>
//         </div>
//         <div className=" bottom-4 right-4 flex flex-row   justify-between w-full xl:mt-3 mt-12 xl:w-7/12 ">
//           <button onClick={goToPreviousQuestion} className="p-3 bg-zinc-500 text-white rounded cursor-pointer">
//             Prev 
//           </button>
//           {saveAndSubmitButtons}
//           <button onClick={goToNextQuestion} className="p-3 bg-zinc-500 text-white rounded cursor-pointer">
//             Next
//           </button>
//         </div>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//     </div>
//   );
// };

// export default QuizPage;
