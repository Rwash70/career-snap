import React, { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './JobCard.css';

const stripHTML = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Simple check to see if text is mostly English ASCII characters
const isEnglish = (text) => {
  const englishLetters = text.match(/[a-zA-Z]/g) || [];
  const ratio = englishLetters.length / text.replace(/\s/g, '').length;
  return ratio > 0.6;
};

const JobCard = ({
  job,
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

  // Determine what description to display
  const displayDescription = isEnglish(cleanDescription)
    ? expanded || !isLong
      ? cleanDescription
      : shortDescription
    : 'Description not available in English. Please visit the job link for details.';

  return (
    <div className='job-card'>
      <h3>{title}</h3>
      <p>Company: {company}</p>
      <p>Location: {location}</p>
      {description && (
        <p className='job-description'>
          {displayDescription}
          {isEnglish(cleanDescription) && isLong && (
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
