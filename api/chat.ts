import type { VercelRequest, VercelResponse } from '@vercel/node';

// This function receives a POST request with { message, persona } in the body
// and forwards it to the Mistral API using your environment variables.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, persona } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message missing' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  const endpoint = process.env.MISTRAL_ENDPOINT; // e.g. https://api.mistral.ai/v1/chat/completions

  try {
    const response = await fetch(endpoint as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral", // adjust depending on the actual model name
        messages: [
          { role: "system", content: persona || "You are a helpful assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'API Error' });
  }
}

