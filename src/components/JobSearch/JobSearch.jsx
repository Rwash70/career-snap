import React, { useEffect, useState } from 'react';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    fetch('https://remoteok.com/api')
      .then((res) => res.json())
      .then((data) => setJobs(data.slice(1))) // skip metadata
      .catch((err) => console.error(err));
  }, []);

  // Calculate current jobs to display
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='job-list'>
      <h1>Remote Jobs</h1>
      {currentJobs.map((job) => (
        <div key={job.id} className='job-card'>
          <h2>{job.position}</h2>
          <p>{job.company}</p>
          <a href={job.url} target='_blank' rel='noopener noreferrer'>
            View Job
          </a>
        </div>
      ))}

      {/* Pagination controls */}
      <div className='pagination'>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
