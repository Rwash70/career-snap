import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home({ isLoggedIn }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  return (
    <div className='home-container'>
      <div className='home-content'>
        <h1 className='main-heading'>Welcome to CareerSnap!</h1>
        <p className='intro-text'>
          Find and track job opportunities that fit your goals.
        </p>
        <div className='home-auth-links'>
          <Link to='/signin' className='btn-signin'>
            Sign In
          </Link>
          {showMessage && (
            <p className='already-signed-in-message'>
              You are already signed in.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
