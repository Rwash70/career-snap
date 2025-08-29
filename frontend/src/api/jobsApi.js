// src/api/jobsApi.js
const BASE_URL = import.meta.env.PROD
  ? '/.netlify/functions/jobs-remote'
  : `${
      import.meta.env.VITE_API_URL || 'http://localhost:3003'
    }/api/jobs/remoteok`;

export const fetchJobs = async (searchTerm = '') => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    const jobs = Array.isArray(data) ? data.slice(1) : []; // skip metadata row
    if (!searchTerm) return jobs.slice(0, 10);

    return jobs.filter(
      (job) =>
        job.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};
