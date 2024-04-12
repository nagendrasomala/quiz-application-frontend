import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import axios from 'axios';
import './viewdata.css'; // Import CSS file for styling

const ViewData = () => {
  const location = useLocation(); // Use useLocation hook inside the functional component

  const [quizData, setQuizData] = useState([]);
  const userId = location.state.id;
  const quizname = location.state.name;
  console.log(quizname)

  // Fetch data from backend API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from the backend API
  const fetchData = async () => {
    try {
      //const response = await axios.get(`http://localhost:4000/q/participants/${userId}`);
      const response = await axios.get(`https://quiz-application-backend-39mn.onrender.com/q/participants/${userId}`);
      
      setQuizData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  };

  // Function to handle download button click
  const handleDownload = async () => {
    try {
      //const response = await axios.post('http://localhost:4000/q/generateExcel', { quizData }, { responseType: 'arraybuffer' });
      const response = await axios.post('https://quiz-application-backend-39mn.onrender.com/q/generateExcel', { quizData }, { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${quizname}.xlsx`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };
  

  return (
    <div className=''>
      
      <nav className="bg-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-white md:text-2xl text-xl xl:text-3xl">{quizname} Data</p>
        </div>
        
          <button className="bg-green-500 text-white hover:bg-green-700 px-4 py-2 rounded focus:outline-none focus:shadow-outline"onClick={handleDownload}>Download Excel</button>
        
       
      </nav>

      <div className='w-full min-h-screen flex flex-col bg-zinc-700 overflow-y-scroll items-center xl:p-0 p-2'>
      <div className=" w-full xl:w-3/5 mt-4 bg-zinc-300">
        <table className=''>
          <thead>
            <tr className=''>
              <th>Student Name</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {quizData.map((data, index) => (
              <tr key={index}>
                <td>{data.name}</td>
                <td>{data.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default ViewData;
