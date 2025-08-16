import React, { useState } from 'react';

const Summarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  const summarize = async () => {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || 'No summary';
    setSummary(result);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Text Summarizer</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full border p-2 mb-4 rounded"
        placeholder="Paste your text here..."
      />
      <button
        onClick={summarize}
        className="bg-green-600 text-white px-4 py-2 mb-4 rounded"
      >
        Summarize
      </button>

      {summary && (
        <div className="border p-4 bg-gray-50 rounded">
          <h2 className="font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
