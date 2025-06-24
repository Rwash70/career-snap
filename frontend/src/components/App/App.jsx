import './App.css';
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Preloader from '../Preloader/Preloader';
import PrivateRoute from '../PrivateRoute';

import Home from '../../pages/Home';
import About from '../../pages/About';
import Jobs from '../../pages/Jobs';
import Saved from '../../pages/Saved';
import Profile from '../../pages/Profile';
import SignIn from '../../pages/SignIn';
import SignUp from '../../pages/SignUp';
import ForgotPassword from '../../pages/ForgotPassword';
import ResetPassword from '../../pages/ResetPassword';
import Logout from '../../pages/Logout';
import { BASE_URL } from '../../utils/constants';

function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  // useEffect(() => {
  //   const checkToken = () => {
  //     const storedToken = localStorage.getItem('token');
  //     setIsLoggedIn(!!storedToken);
  //   };
  //   checkToken();
  //   window.addEventListener('storage', checkToken);
  //   return () => window.removeEventListener('storage', checkToken);
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchSavedJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/savedJobs/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSavedJobs(data || []);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    if (isLoggedIn) {
      fetchSavedJobs();
    }
  }, [isLoggedIn]);

  const toggleSaveJob = async (job) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Use the remote job id to check if saved
    const isSaved = savedJobs.find((savedJob) => savedJob.id === job.id);
    if (isSaved) {
      try {
        await fetch(`${BASE_URL}/api/savedJobs/${isSaved._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs((prev) =>
          prev.filter((savedJob) => savedJob._id !== isSaved._id)
        );
      } catch (error) {
        console.error('Error deleting saved job:', error);
      }
    } else {
      try {
        const res = await fetch(`${BASE_URL}/api/savedJobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            position: job.position,
            company: job.company,
            url: job.url,
            id: job.id,
          }),
        });

        const data = await res.json();
        if (data.job) {
          setSavedJobs((prev) => [...prev, data.job]);
        }
      } catch (error) {
        console.error('Error saving job:', error);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  function SignInWithMessage() {
    useEffect(() => {
      setShowMessage(true);
    }, []);
    return (
      <div>
        {showMessage && (
          <div className='already-signed-in-message'>
            You are already signed in
          </div>
        )}
        <Navigate to='/' replace />
      </div>
    );
  }

  return (
    <Router>
      <div className='app-container'>
        <header className='header'>
          <Header />
          <Navigation />
        </header>

        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path='/about' element={<About />} />
            <Route
              path='/jobs'
              element={
                <Jobs
                  savedJobs={savedJobs}
                  toggleSaveJob={toggleSaveJob}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path='/saved'
              element={
                <Saved
                  savedJobs={savedJobs}
                  toggleSaveJob={toggleSaveJob}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path='/signin'
              element={
                isLoggedIn ? (
                  <Navigate to='/' replace />
                ) : (
                  <SignIn setIsLoggedIn={setIsLoggedIn} />
                )
              }
            />
            <Route path='/signup' element={<SignUp />} />
            {/* Reset password is now public */}
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route
              path='/logout'
              element={<Logout setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </main>

        <footer className='footer'>
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;
