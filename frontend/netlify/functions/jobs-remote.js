// Netlify Function: paginated + trimmed response to stay under 6MB
export async function handler(event) {
  try {
    // Query params: ?q=search&page=1&pageSize=50
    const params = event?.queryStringParameters || {};
    const q = (params.q || '').toLowerCase().trim();
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const pageSize = Math.min(
      100,
      Math.max(10, parseInt(params.pageSize || '50', 10))
    );

    // Fetch upstream
    const upstream = await fetch('https://remotive.com/api/remote-jobs', {
      headers: { Accept: 'application/json' },
    });
    if (!upstream.ok) {
      return {
        statusCode: upstream.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Upstream error' }),
      };
    }
    const data = await upstream.json();
    const all = Array.isArray(data?.jobs) ? data.jobs : [];

    // Optional filter by q (title/company/location)
    const filtered = q
      ? all.filter((j) => {
          const title = (j.title || '').toLowerCase();
          const company = (j.company_name || '').toLowerCase();
          const loc = (j.candidate_required_location || '').toLowerCase();
          return title.includes(q) || company.includes(q) || loc.includes(q);
        })
      : all;

    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filtered.slice(start, end);

    // Compact rows + trim description to keep payload small
    const rows = pageItems.map((j) => ({
      id: String(j.id),
      position: j.title,
      company: j.company_name,
      location: j.candidate_required_location || 'Remote',
      description: (j.description || '').slice(0, 1200), // ~1.2KB cap
      url: j.url,
    }));

    // Array with metadata first (your frontend uses data.slice(1))
    const result = [
      { provider: 'remotive', total: filtered.length, page, pageSize },
      ...rows,
    ];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120',
      },
      body: JSON.stringify(result),
    };
  } catch {
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to fetch jobs' }),
    };
  }
}
