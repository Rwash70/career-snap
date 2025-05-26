import React from 'react';

export default function Saved({ savedJobs, toggleSaveJob, isLoggedIn }) {
  return (
    <div className='saved-jobs-container'>
      <h1 className='saved-jobs-title'>Saved Jobs</h1>

      {savedJobs.length > 0 ? (
        savedJobs.map((job) => (
          <div key={job.id || job.url} className='job-card'>
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
            {isLoggedIn && (
              <button
                className='job-card-save-btn'
                onClick={() => toggleSaveJob(job)}
              >
                Unsave
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No saved jobs yet.</p>
      )}
    </div>
  );
}
