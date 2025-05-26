import React, { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './JobCard.css';

const stripHTML = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const JobCard = ({
  job, // <-- added full job object
  title,
  company,
  location,
  description,
  link,
  isSaved,
  toggleSaveJob,
  isLoggedIn,
}) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300;

  const cleanDescription = description ? stripHTML(description) : '';
  const isLong = cleanDescription.length > maxLength;
  const shortDescription = cleanDescription.slice(0, maxLength) + '...';

  return (
    <div className='job-card'>
      <h3>{title}</h3>
      <p>Company: {company}</p>
      <p>Location: {location}</p>
      {description && (
        <p className='job-description'>
          {expanded || !isLong ? cleanDescription : shortDescription}
          {isLong && (
            <button
              className='read-more-button'
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      )}
      <a
        href={link}
        target='_blank'
        rel='noopener noreferrer'
        className='apply-now-link'
      >
        Apply
      </a>
      <button
        className={`job-card-save-icon-btn ${isSaved ? 'saved' : ''}`}
        onClick={() => toggleSaveJob(job)} // <-- pass the job here
        disabled={!isLoggedIn}
        style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
        aria-label={isSaved ? 'Unsave job' : 'Save job'}
      >
        {isSaved ? (
          <FaBookmark className='save-icon' />
        ) : (
          <FaRegBookmark className='save-icon' />
        )}
      </button>
    </div>
  );
};

export default JobCard;
