export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
    }

  const text = req.body && req.body.text;

  if (!text) {
    return res.status(400).json({ error: 'Missing text to summarize' });
  }

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
          { role: 'system', content: 'Summarize this text.' },
          { role: 'user', content: text }
        ]
      })
    });

    const data = await response.json();
    const summary = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

    res.status(200).json({ summary });
  } catch (err) {
    console.error('Summarize error:', err);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
}
