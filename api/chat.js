export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  // Validate HTTP method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { message, persona } = req.body || {};

  // Validate message input
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Missing or invalid message. Must be a non-empty string.' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  const model = process.env.MISTRAL_MODEL || 'mistral-small';

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Mistral API Key in environment variables.' });
  }

  const endpoint = 'https://api.mistral.ai/v1/chat/completions';
  const prompt = persona ? `${persona}\n${message}` : message;

  try {
    const mistralResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
      }),
    });

    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text();
      console.error('Mistral API error:', errorText);
      return res.status(502).json({ error: 'Mistral API error', detail: errorText });
    }

    const data = await mistralResponse.json();
    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error('Unexpected Mistral response:', data);
      return res.status(502).json({ error: 'Invalid response format from Mistral' });
    }

    return res.status(200).json({ message: content });
  } catch (err) {
    console.error('Unhandled server error:', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
}
