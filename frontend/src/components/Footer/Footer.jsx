import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className='footer'>
      <p>&copy; {new Date().getFullYear()} CareerSnap. All rights reserved.</p>
      <p className='footer-link'>
        <Link to='/about'>About</Link>
      </p>
    </footer>
  );
}

export default Footer;
