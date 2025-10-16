import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MovieApp from './components/MovieApp.tsx';
import Login from './components/login/Login.tsx';
import Register from './components/register/Register.tsx';

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
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
