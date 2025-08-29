import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    // Clear token, auth message, and update login state
    localStorage.removeItem('token');
    sessionStorage.removeItem('authMessage');
    setIsLoggedIn(false);
    setMessageVisible(true);

    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, setIsLoggedIn]);

  return (
    <div className='logout-container'>
      {messageVisible && (
        <p className='logout-message'>You have been logged out.</p>
      )}
    </div>
  );
}

export default Logout;
