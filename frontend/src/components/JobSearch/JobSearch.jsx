import React, { useEffect, useState, useRef } from 'react';
import './JobSearch.css';
import JobCard from '../JobCard/JobCard';

const JobSearch = ({
  searchTerm,
  savedJobs = [],
  toggleSaveJob,
  isLoggedIn,
}) => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const topRef = useRef(null);

  // ✅ Fetch all jobs once on initial render
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://remoteok.com/api');
        const data = await res.json();
        setJobs(data.slice(1)); // Remove metadata
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  const decodeText = (text) => {
    if (!text) return '';
    try {
      const utfDecoded = decodeURIComponent(escape(text));
      const txt = document.createElement('textarea');
      txt.innerHTML = utfDecoded;
      return txt.value;
    } catch {
      return text;
    }
  };

  // ✅ Filter jobs by search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isJobSaved = (job) => {
    return (
      Array.isArray(savedJobs) && savedJobs.some((saved) => saved.id === job.id)
    );
  };

  return (
    <div className='job-search-container' ref={topRef}>
      <h1 className='job-search-title'>Remote Jobs</h1>

      {currentJobs.length > 0 ? (
        currentJobs.map((job) => (
          <JobCard
            key={job.id}
            title={decodeText(job.position)}
            company={decodeText(job.company)}
            location={job.location || 'Remote'}
            description={decodeText(job.description)}
            link={job.url}
            isSaved={isJobSaved(job)}
            toggleSaveJob={() => toggleSaveJob(job)}
            isLoggedIn={isLoggedIn}
          />
        ))
      ) : (
        <p className='no-jobs-message'>No jobs found.</p>
      )}

      <div className='pagination'>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
            className='pagination-btn'
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
