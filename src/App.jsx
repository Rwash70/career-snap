import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Preloader from './components/Preloader/Preloader';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Saved from './pages/Saved';
import Profile from './pages/Profile';

function App() {
  const [loading, setLoading] = useState(true);

  // Saved jobs state
  const [savedJobs, setSavedJobs] = useState(() => {
    // Load saved jobs from localStorage or start empty
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Toggle save/unsave job
  const toggleSaveJob = (job) => {
    setSavedJobs((prevSavedJobs) => {
      const isSaved = prevSavedJobs.find((savedJob) => savedJob.id === job.id);
      if (isSaved) {
        // Remove if already saved
        return prevSavedJobs.filter((savedJob) => savedJob.id !== job.id);
      } else {
        // Add if not saved
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
            {/* Pass savedJobs and toggleSaveJob to Jobs page */}
            <Route
              path='/jobs'
              element={
                <Jobs savedJobs={savedJobs} toggleSaveJob={toggleSaveJob} />
              }
            />
            {/* Pass savedJobs and toggleSaveJob to Saved page */}
            <Route
              path='/saved'
              element={
                <Saved savedJobs={savedJobs} toggleSaveJob={toggleSaveJob} />
              }
            />
            <Route path='/profile' element={<Profile />} />
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
