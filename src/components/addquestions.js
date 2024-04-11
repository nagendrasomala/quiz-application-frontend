import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

const AddQuestionPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [quizId, setQuizId] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.id) {
      setQuizId(location.state.id);
      fetchQuizData(location.state.id);
    }
  }, [location]);

  const fetchQuizData = async (quizId) => {
    try {
      // const response = await fetch(`http://localhost:4000/q/${quizId}`);     
      const response = await fetch(`https://quiz-application-backend-39mn.onrender.com/q/${quizId}`); 
      const data = await response.json();
      console.log(data)
      console.log(data.questionsCount+" count");
      setNumberOfQuestions(data.questionsCount);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const addQuestion = async () => {
    try {
      //const response = await fetch(`http://localhost:4000/q/add/${quizId}`, {
      const response = await fetch(`https://quiz-application-backend-39mn.onrender.com/q/add/${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: question,
          options,
          correctAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Question added successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // Reset the form after submitting
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };
  
  
  return (
    <div className="min-h-screen bg-zinc-700 flex items-center justify-center">
      <div className="bg-zinc-600 p-8 rounded shadow-md w-full md:w-1/2 lg:w-2/3 xl:w-2/4">
        <h1 className="text-2xl font-bold mb-4">Add Question</h1>
        <form className="space-y-4">
          <div className="flex flex-col ">
            <label htmlFor="questionText" className="text-sm text-gray-300">
              Question:
            </label>
            <input
              type="text"
              id="questionText"
              className="border bg-gray-500 rounded px-3 py-1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {options.map((option, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={`option${index + 1}`} className="text-sm text-gray-300">
                Option {index + 1}:
              </label>
              <input
                type="text"
                id={`option${index + 1}`}
                className="border bg-gray-500 rounded px-2 py-1"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="correctAnswer" className="text-sm px-3 text-gray-300">
              Correct Answer:
            </label>
            <input
              type="text"
              id="correctAnswer"
              className="border bg-gray-500 rounded px-2 py-1"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            />
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Question
          </button>
        </form>
      

      </div>
    </div>
  );
};

export default AddQuestionPage;
