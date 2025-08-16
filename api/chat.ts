export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, persona } = req.body;

  try {
    const response = await fetch(process.env.MISTRAL_ENDPOINT as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral",
        messages: [
          { role: "system", content: persona || "You are a helpful assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error calling API' });
  }
}
