import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
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
        </div>
      </div>
    </div>
  );
}
