import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/signin');
  }, [navigate]);

  return (
    <div className='logout-container'>
      <p className='logout-message'>Logging out...</p>
    </div>
  );
}

export default Logout;
