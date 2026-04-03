const SECTION_MAP = {
  "REGULATORY": "REGULATORY", "Regulatory": "REGULATORY",
  "EDUCATION": "EDUCATION", "Education": "EDUCATION",
  "ETHICS": "ETHICS", "Ethics": "ETHICS",
  "PROCUREMENT": "PROCUREMENT", "Procurement": "PROCUREMENT",
  "GLOBAL": "GLOBAL", "Global": "GLOBAL",
  "SUSTAINABILITY": "SUSTAINABILITY", "Sustainability": "SUSTAINABILITY",
  "PRACTICE_FEED": "PRACTICE_FEED", "Practice": "PRACTICE_FEED",
  "PRACTICE_MANAGEMENT": "PRACTICE_MANAGEMENT", "Planning": "REGULATORY",
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    const { payload } = body;
    const section = SECTION_MAP[payload.section] || "PRACTICE_FEED";
    const slug = payload.slug + "-" + Math.random().toString(36).slice(2,8);
    const clean = {
      title:    payload.title,
      slug,
      summary:  payload.summary,
      content:  payload.content,
      section,
      status:   "DRAFT",
      author:   "Content Monitor",
      source:   payload.source || null,
      tags:     [],
      featured: false,
      urgent:   false,
    };
    const response = await fetch('https://profpracarch.org/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer profprac2026admin',
      },
      body: JSON.stringify(clean),
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
export const config = { api: { bodyParser: true } };
