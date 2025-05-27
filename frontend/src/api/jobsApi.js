const BASE_URL = 'https://remoteok.com/api';

export const fetchJobs = async (searchTerm = '') => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    const jobs = data.slice(1); // skip metadata
    if (!searchTerm) return jobs.slice(0, 10); // default: first 10 jobs

    // filter if there's a search term
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
