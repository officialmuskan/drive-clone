import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-title">Image Folder App</h1>
        {user && user.username ? (<div className="nav-right">
          <span className="username">Welcome, {user.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>) : (
          <div className="nav-right">
            <button className="submit-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;