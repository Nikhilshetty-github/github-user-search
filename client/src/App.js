import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination';


function App() {
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalNumberOfPages = 10;

  const handleInputChange = async (e) => {
    const username = e.target.value;
    setInputValue(username);

    try {
      const response = await axios.get(`http://localhost:5000/users/${username}?page=1`);
      setUserData(response.data);
    } catch (error) {
      setUserData([]);
    }
  };

  const handlePageChange = async (page) => {
    try {
      const username = inputValue;
      const response = await axios.get(`http://localhost:5000/users/${username}?page=${page}`);
      setUserData(response.data);
      setCurrentPage(page);
    } catch (error) {
      setUserData([]);
    }
  };

  function FollowersNumber ({username}) {
    const [additionalData, setAdditionalData] = useState(0);

    useEffect(() => {
      axios.get(`http://localhost:5000/followers/${username}`)
      .then(response => {
        console.log(response.data);
        setAdditionalData(response.data);
      })
      .catch(error => {
        console.error('Error fetching additional data:', error);
      });
    },[username]);

    return (
      <p>Followers: {additionalData ? additionalData.followerCount : 'Loading...'}</p>
    );
  };

  const renderPagination = () => {
    if (userData.length > 0) {
      return (
        <div className="text-center">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalNumberOfPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalNumberOfPages}
          />
          <Pagination.Last onClick={() => handlePageChange(totalNumberOfPages)} />
        </Pagination>
      </div>
      );
    }
    return null;
  };

  function UserCard({ user }) {
    return (
      <div className="user-card">
        <img src={user.avatar_url} alt="User Avatar" />
        <h2>{user.login}</h2>
        <FollowersNumber username={user.login}/>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <input type="text" value={inputValue} onChange={handleInputChange} />
      </div>
      <div className="user-cards">
        {userData &&
          userData.map((user, index) => (
            <UserCard key={index} user={user} />
          ))}
      </div>
      {renderPagination()}
    </div>
  );
}

export default App;
