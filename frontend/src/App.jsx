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
import ResetPassword from './pages/ResetPassword';
import Logout from './pages/Logout';

function App() {
  const [loading, setLoading] = useState(true);

  // Saved jobs state
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleSaveJob = (job) => {
    setSavedJobs((prevSavedJobs) => {
      const isSaved = prevSavedJobs.find((savedJob) => savedJob.id === job.id);
      if (isSaved) {
        return prevSavedJobs.filter((savedJob) => savedJob.id !== job.id);
      } else {
        return [...prevSavedJobs, job];
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
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
            <Route path='/' element={<Home />} />
            <Route
              path='/jobs'
              element={
                <Jobs savedJobs={savedJobs} toggleSaveJob={toggleSaveJob} />
              }
            />
            <Route
              path='/saved'
              element={
                <Saved savedJobs={savedJobs} toggleSaveJob={toggleSaveJob} />
              }
            />
            {/* Public auth routes */}
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            {/* Protected routes */}
            <Route
              path='/reset-password'
              element={
                <PrivateRoute>
                  <ResetPassword />
                </PrivateRoute>
              }
            />
            <Route path='/logout' element={<Logout />} />
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            {/* Redirect unknown routes to home */}
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
