import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Preloader from './components/Preloader/Preloader';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Logout from './pages/Logout';

function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  // Token sync
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem('token');
      setIsLoggedIn(!!storedToken);
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  // Fetch saved jobs when logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchSavedJobs = async () => {
      try {
        const res = await fetch('http://localhost:3002/api/savedJobs/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSavedJobs(data || []);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    if (isLoggedIn) {
      fetchSavedJobs();
    }
  }, [isLoggedIn]);

  // ✅ Toggle saved job: POST if new, DELETE if existing
  const toggleSaveJob = async (job) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isSaved = savedJobs.find((savedJob) => savedJob.url === job.url);

    if (isSaved) {
      // DELETE from backend
      try {
        await fetch(`http://localhost:3002/api/savedJobs/${isSaved._id}`, {
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
      // POST to backend
      try {
        const res = await fetch('http://localhost:3002/api/savedJobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            position: job.position,
            company: job.company,
            url: job.url,
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

            <Route
              path='/reset-password'
              element={
                <PrivateRoute>
                  <ResetPassword />
                </PrivateRoute>
              }
            />

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
