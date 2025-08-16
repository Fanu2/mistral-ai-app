import React, { useState } from 'react';

const personas = [
  { label: 'Professional', value: 'You are a professional assistant.' },
  { label: 'Casual', value: 'You are a casual, friendly assistant.' },
  { label: 'Humorous', value: 'You are a humorous assistant.' },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState(personas[0].value);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, 'You: ' + userMessage]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, persona }),
    });

    const data = await res.json();
    const botReply = data.choices?.[0]?.message?.content || 'No reply';

    setMessages((prev) => [...prev, 'Bot: ' + botReply]);
    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mistral Chat</h1>
      <select
        className="border p-2 mb-3"
        value={persona}
        onChange={(e) => setPersona(e.target.value)}
      >
        {personas.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <div className="border p-4 h-64 overflow-y-auto mb-4 bg-gray-50 rounded">
        {messages.map((m, i) => (
          <div key={i} className="mb-2 text-sm">{m}</div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
