import { sendToMistral } from '@/lib/mistralClient';

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  console.log('Incoming request:', req.method, req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { message, persona } = req.body || {};

  if (typeof message !== 'string' || !message.trim()) {
    console.warn('Invalid message:', message);
    return res.status(400).json({ error: 'Missing or invalid message.' });
  }

  try {
    const reply = await sendToMistral({ message, persona });
    console.log('Mistral reply:', reply);
    return res.status(200).json({ message: reply });
  } catch (err) {
    console.error('Mistral error:', err);

    // Optional fallback for dev/testing
    const fallback = `🤖 Sorry, I couldn't reach Mistral. Here's a mock reply: "${message}" sounds interesting! Tell me more.`;
    return res.status(200).json({ message: fallback, fallback: true });
  }
}
