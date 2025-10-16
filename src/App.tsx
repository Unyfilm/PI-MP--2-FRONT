import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MovieApp from './components/MovieApp';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Recover from './components/recover/Recover';
import ResetPassword from './components/recover/ResetPassword';
import Profile from './components/profile/Profile';
import ProfileEdit from './components/profile/ProfileEdit';

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
        <Route path="/recover" element={<Recover />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
