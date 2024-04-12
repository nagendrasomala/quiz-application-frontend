import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facultyId =location.state.id;
  
  const [quizData, setQuizData] = useState({
    quizName: '',
    quizDescription: '',
    quizCode: '',
    numberOfQuestions: '',
    time:'',
    date:'',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
    console.log(quizData);
    console.log(facultyId)
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/q/create', {
      //const response = await axios.post('https://quiz-application-backend-39mn.onrender.com/q/create', {
        facultyId,
        ...quizData,
        
      });
      console.log('Quiz created successfully:', response.data);
      console.log('Quiz created successfully:', response.data._id);
      navigate("/addquestions",{state:{id:response.data._id}});
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center">
      <form className="w-full max-w-lg bg-gray-800 shadow-md rounded-lg p-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-white mb-6">Create Quiz</h2>
        <div className="mb-4">
          <input placeholder='Quiz Name' type="text" name="quizName" id="quizName" className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white" value={quizData.quizName} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <textarea placeholder='Quiz Description' name="quizDescription" id="quizDescription" className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white" value={quizData.quizDescription} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <input placeholder='Quiz Code' type="text" name="quizCode" id="quizCode" className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white" value={quizData.quizCode} onChange={handleChange} required />
        </div>
        <div className="mb-4">          
          <input placeholder='Number of Questions' type="number" name="numberOfQuestions" id="numberOfQuestions" className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white" value={quizData.numberOfQuestions} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          
          <input placeholder='Time in Minutes' type="number" name="time" id="time" className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white" value={quizData.time} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <input placeholder='Date' type="date" name="date" id="date" className="w-full xl:h-10 md:h-8 rounded-md p-4 mb-7 bg-zinc-600 text-white" value={quizData.date} onChange={handleChange} required />
        </div>
        <button type="submit" className="bg-green-500 text-white hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-64 mt-4">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
