export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    console.log('Body received:', JSON.stringify(body));
    const { payload, cmsKey } = body;
    console.log('Payload:', JSON.stringify(payload));
    console.log('CmsKey present:', !!cmsKey);
    const clean = {
      title:    payload.title,
      slug:     payload.slug,
      summary:  payload.summary,
      content:  payload.content,
      section:  payload.section,
      status:   "DRAFT",
      author:   "Content Monitor",
      source:   payload.source || null,
      tags:     [],
      featured: false,
      urgent:   false,
    };
    console.log('Sending to CMS:', JSON.stringify(clean));
    const response = await fetch('https://profpracarch.org/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cmsKey}`,
      },
      body: JSON.stringify(clean),
    });
    console.log('CMS response status:', response.status);
    const text = await response.text();
    console.log('CMS response body:', text);
    res.status(response.status).send(text);
  } catch (e) {
    console.error('Error:', e.message, e.stack);
    res.status(500).json({ error: e.message });
  }
}
export const config = { api: { bodyParser: true } };
