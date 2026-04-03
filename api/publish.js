export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { payload, cmsKey } = req.body;
    const response = await fetch('https://profpracarch.org/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cmsKey}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
