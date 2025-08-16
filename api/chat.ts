export default async function handler(req: any, res: any) {
  const prompt = req.body?.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
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
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to call Mistral API' });
  }
}
