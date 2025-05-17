import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();
  const isJobsPage = location.pathname === '/jobs';

  return (
    <nav className={`nav-bar ${isJobsPage ? 'center-nav' : ''}`}>
      <div className='nav-links'>
        <Link to='/' className='nav-link'>
          Home
        </Link>
        <Link to='/jobs' className='nav-link'>
          Jobs
        </Link>

        {location.pathname === '/jobs' ? (
          <Link to='/saved' className='nav-link'>
            Save
          </Link>
        ) : (
          <span className='nav-link disabled-link'>Save</span>
        )}

        <Link to='/profile' className='nav-link'>
          Profile
        </Link>
      </div>
    </nav>
  );
}
