import React, { useEffect, useState, useRef } from 'react';
import './JobSearch.css';
import JobCard from '../JobCard/JobCard';

const JobSearch = ({
  searchTerm = '',
  savedJobs = [],
  toggleSaveJob,
  isLoggedIn,
}) => {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const topRef = useRef(null);

  // Use this constant for any visible "test link" in production
  const PROD_API = 'https://careersnap.l5.ca';

  // Fetch all jobs once on initial render
  useEffect(() => {
    const fetchJobs = async () => {
      setStatus('loading');
      setErrorMsg('');

      // In prod: ALWAYS use your public backend
      // In dev: use localhost unless VITE_API_URL overrides it
      const API_BASE = import.meta.env.PROD
        ? PROD_API
        : import.meta.env.VITE_API_URL || 'http://localhost:3003';

      const url = `${API_BASE}/api/jobs/remoteok`;

      try {
        // Optional: uncomment to verify URL in console
        // console.log('Fetching jobs from:', url);

        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);

        const data = await res.json();
        const rows = Array.isArray(data) ? data.slice(1) : []; // remove metadata row
        setJobs(rows);
        setStatus('ready');
      } catch (e) {
        console.error('Job fetch failed:', e);
        setStatus('error');
        setErrorMsg(String(e?.message || e));
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Keep current page within range when filtering changes totals
  useEffect(() => {
    const filteredCount = jobs.filter((job) => {
      const q = (searchTerm || '').toLowerCase();
      return (
        job?.position?.toLowerCase().includes(q) ||
        job?.company?.toLowerCase().includes(q)
      );
    }).length;
    const maxPage = Math.max(1, Math.ceil(filteredCount / jobsPerPage));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [jobs, searchTerm, currentPage]);

  // Scroll to top on page change
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  // Safely decode HTML/UTF-8 text from API
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

  // Filter jobs by search term
  const filteredJobs = jobs.filter((job) => {
    const q = (searchTerm || '').toLowerCase();
    return (
      job?.position?.toLowerCase().includes(q) ||
      job?.company?.toLowerCase().includes(q)
    );
  });

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const isJobSaved = (job) =>
    Array.isArray(savedJobs) && savedJobs.some((saved) => saved.id === job.id);

  // Build compact page list with ellipses
  const buildPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let p = 1; p <= totalPages; p++) pages.push(p);
      return pages;
    }
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1);
    if (start > 2) pages.push('…-left');
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < totalPages - 1) pages.push('…-right');
    pages.push(totalPages);
    return pages;
  };

  const pagesToRender = buildPages();

  return (
    <div className='job-search-container' ref={topRef}>
      <h1 className='job-search-title'>Remote Jobs</h1>

      {status === 'loading' && <p>Loading jobs…</p>}

      {status === 'error' && (
        <p className='no-jobs-message'>
          Couldn’t load jobs: {errorMsg}
          <br />
          Test the backend directly:{' '}
          <a
            href={`${PROD_API}/api/jobs/remoteok`}
            target='_blank'
            rel='noreferrer'
          >
            {`${PROD_API}/api/jobs/remoteok`}
          </a>
        </p>
      )}

      {status === 'ready' &&
        (currentJobs.length > 0 ? (
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
        ))}

      {status === 'ready' && totalPages > 1 && (
        <div className='pagination'>
          {pagesToRender.map((item, idx) =>
            typeof item === 'number' ? (
              <button
                key={`p-${item}`}
                onClick={() => handlePageChange(item)}
                disabled={currentPage === item}
                className='pagination-btn'
              >
                {item}
              </button>
            ) : (
              <span key={`e-${idx}`} className='pagination-ellipsis'>
                …
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
