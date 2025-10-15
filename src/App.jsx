import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import MovieApp from './components/MovieApp';
import Login from './components/login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieApp />} />
        <Route path="/home" element={<MovieApp />} />
        <Route path="/catalog" element={<MovieApp />} />
        <Route path="/about" element={<MovieApp />} />
        <Route path="/sitemap" element={<MovieApp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
