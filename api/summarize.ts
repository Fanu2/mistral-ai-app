import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text missing' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  const endpoint = process.env.MISTRAL_ENDPOINT;

  try {
    const response = await fetch(endpoint as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral",
        messages: [
          { role: "system", content: "Summarize the text provided by the user." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'API Error' });
  }
}
