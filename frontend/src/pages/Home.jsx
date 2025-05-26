import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home({ isLoggedIn }) {
  const [showRedirectMessage, setShowRedirectMessage] = useState('');

  useEffect(() => {
    const message = sessionStorage.getItem('redirectMessage');
    if (message) {
      setShowRedirectMessage(message);
      sessionStorage.removeItem('redirectMessage');
    }
  }, []);

  return (
    <div className='home-container'>
      <div className='home-content'>
        <h1 className='home-heading'>Welcome to CareerSnap!</h1>
        <p className='home-intro-text'>
          Find and track remote opportunities that fit your goals.
        </p>
        <div className='home-auth-links'>
          <Link to='/signin' className='btn-signin'>
            Sign In
          </Link>
          {showRedirectMessage && (
            <p className='already-signed-in-message'>{showRedirectMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
