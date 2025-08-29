// routes/jobs.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Normalize Remotive job → RemoteOK-like shape your UI uses
function mapRemotiveJob(j) {
  return {
    id: String(j.id),
    position: j.title,
    company: j.company_name,
    location: j.candidate_required_location || 'Remote',
    description: j.description || '',
    url: j.url,
  };
}

// GET /api/jobs/remoteok  (keeps the same path your frontend calls)
router.get('/remoteok', async (req, res) => {
  try {
    // Optional: support search via ?q=term
    const q = (req.query.q || '').trim();

    const { data } = await axios.get('https://remotive.com/api/remote-jobs', {
      params: q ? { search: q } : {},
      timeout: 12000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari/537.36 CareerSnap/1.0',
        Accept: 'application/json,text/plain,*/*',
      },
    });

    const jobs = Array.isArray(data?.jobs) ? data.jobs.map(mapRemotiveJob) : [];

    // Keep your frontend happy: first element is “metadata”, then jobs
    const payload = [{ provider: 'remotive', total: jobs.length }, ...jobs];

    res.json(payload);
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;
    console.error('Remotive fetch failed:', {
      message: err.message,
      status,
      snippet: typeof body === 'string' ? body.slice(0, 200) : body,
    });
    res.status(502).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
