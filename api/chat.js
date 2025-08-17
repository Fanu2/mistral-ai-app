export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { message, persona } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message.' });
  }

  const endpoint = 'https://api.mistral.ai/v1/chat/completions';
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Mistral API key missing.' });
  }

  // Use your actual model here. Example: 'mistral-medium' or 'mistral-small'
  const model = process.env.MISTRAL_MODEL || 'mistral-medium';

  // Construct prompt:
  const prompt = persona ? `${persona}\n${message}` : message;

  try {
    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    });

    if (!apiRes.ok) {
      const textErr = await apiRes.text();
      console.error('Mistral API error:', textErr);
      throw new Error('Mistral did not respond OK');
    }

    const data = await apiRes.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Mistral');
    }

    const content = data.choices[0].message.content.trim();
    return res.status(200).json({ message: content });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(200).json({
      message: `🤖 Sorry, I couldn't reach Mistral. Here's a mock reply: "${message}" sounds interesting! Tell me more.`,
      fallback: true
    });
  }
}
