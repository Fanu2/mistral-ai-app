import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Chat from './pages/Chat';
import Summarizer from './pages/Summarizer';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="p-4 font-sans">
        <nav className="flex gap-4 mb-6">
          <NavLink to="/" end className="text-blue-600">Chat</NavLink>
          <NavLink to="/summarizer" className="text-blue-600">Summarizer</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/summarizer" element={<Summarizer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
