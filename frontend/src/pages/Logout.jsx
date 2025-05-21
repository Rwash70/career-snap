import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout() {
  const navigate = useNavigate();
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
    setMessageVisible(true);

    const timeout = setTimeout(() => {
      navigate('/signin');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className='logout-container'>
      {messageVisible && (
        <p className='logout-message'>You are now logged out.</p>
      )}
    </div>
  );
}

export default Logout;
