export default async function handler(req, res) {
  const text = req.body && req.body.text;

  if (!text) {
    return res.status(400).json({ error: 'Missing text to summarize' });
  }

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [{ role: 'user', content: `Summarize this: ${text}` }],
      }),
    });

    const data = await response.json();
    const summary = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
}
