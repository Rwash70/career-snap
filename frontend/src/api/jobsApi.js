// src/api/jobsApi.js
const BASE_URL = import.meta.env.PROD
  ? // Netlify (production): use serverless function + larger batch
    '/.netlify/functions/jobs-remote?size=300'
  : // Local/dev: use your backend proxy (or override with VITE_API_URL)
    `${
      import.meta.env.VITE_API_URL || 'http://localhost:3003'
    }/api/jobs/remoteok`;

export const fetchJobs = async (searchTerm = '') => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    // RemoteOK returns a metadata object at index 0; strip it
    const jobs = Array.isArray(data) ? data.slice(1) : [];

    // Return ALL jobs when no search term; JobSearch.jsx handles pagination
    if (!searchTerm) return jobs;

    const q = (searchTerm || '').toLowerCase();
    return jobs.filter(
      (job) =>
        job.position?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q)
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};
