import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data from the API
    axios.get('http://localhost:4000/user/getall')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="leaderboard-container mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-zinc-700">
      {users.map((user, index) => (
        <div key={index} className="user-card bg-white border rounded-lg p-4 mb-4 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-row justify-between">
          <h3 className="text-xl font-semibold mb-2 text-zinc-900">{user.name}</h3>
          <p className="text-gray-600">Marks: {user.marks}</p>
          <p className="text-gray-600">Score: {user.score}</p>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
