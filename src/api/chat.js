export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, persona } = req.body;

  try {
    const endpoint = process.env.MISTRAL_ENDPOINT;
    const apiKey    = process.env.MISTRAL_API_KEY;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral',
        messages: [
          { role: 'system', content: persona || 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'API error' });
  }
}
