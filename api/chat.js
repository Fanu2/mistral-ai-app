export const config = {
  api: { bodyParser: true }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, persona } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Mistral API Key' });
  }

  const endpoint = 'https://api.mistral.ai/v1/chat/completions';
  const prompt = persona
    ? `${persona}\n${message}`
    : message;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL || 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral API error:', errText);
      return res.status(500).json({ error: 'Mistral API error', detail: errText });
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: 'Invalid response format from Mistral' });
    }

    const content = data.choices[0].message.content.trim();
    res.status(200).json({ message: content });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
}
