import React, { useEffect, useState, useRef } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

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

  useEffect(() => {
    fetch('https://remoteok.com/api')
      .then((res) => res.json())
      .then((data) => setJobs(data.slice(1)))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    // scroll to top when currentPage changes
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

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

  const isJobSaved = (job) =>
    Array.isArray(savedJobs) && savedJobs.some((saved) => saved.id === job.id);

  return (
    <div className='job-search-container' ref={topRef}>
      <h1 className='job-search-title'>Remote Jobs</h1>
      {currentJobs.length > 0 ? (
        currentJobs.map((job) => (
          <div key={job.id} className='job-card'>
            <h2 className='job-card-title'>{job.position}</h2>
            <p className='job-card-company'>{job.company}</p>
            <a
              href={job.url}
              target='_blank'
              rel='noopener noreferrer'
              className='job-card-link'
            >
              View Job
            </a>
            <button
              className={`job-card-save-icon-btn ${
                isJobSaved(job) ? 'saved' : ''
              }`}
              onClick={() => toggleSaveJob(job)}
              aria-label={isJobSaved(job) ? 'Unsave job' : 'Save job'}
              disabled={!isLoggedIn} // Disable if NOT logged in
              style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
            >
              {isJobSaved(job) ? (
                <FaBookmark className='save-icon' />
              ) : (
                <FaRegBookmark className='save-icon' />
              )}
            </button>
          </div>
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
