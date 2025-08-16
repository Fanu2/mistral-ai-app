import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import Chat from './pages/Chat';
import Summarizer from './pages/Summarizer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="p-4 font-sans">
        <nav className="flex gap-4 mb-6">
          <NavLink to="/" end className="text-blue-600">
            Chat
          </NavLink>
          <NavLink to="/summarizer" className="text-blue-600">
            Summarizer
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/summarizer" element={<Summarizer />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
