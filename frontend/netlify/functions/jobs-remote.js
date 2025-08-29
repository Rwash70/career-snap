export async function handler() {
  try {
    const r = await fetch('https://remotive.com/api/remote-jobs', {
      headers: { Accept: 'application/json' },
    });
    if (!r.ok) {
      return {
        statusCode: r.status,
        body: JSON.stringify({ error: 'Upstream error' }),
      };
    }
    const data = await r.json();
    const jobs = Array.isArray(data?.jobs)
      ? data.jobs.map((j) => ({
          id: String(j.id),
          position: j.title,
          company: j.company_name,
          location: j.candidate_required_location || 'Remote',
          description: j.description || '',
          url: j.url,
        }))
      : [];
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify([
        { provider: 'remotive', total: jobs.length },
        ...jobs,
      ]),
    };
  } catch {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Failed to fetch jobs' }),
    };
  }
}
