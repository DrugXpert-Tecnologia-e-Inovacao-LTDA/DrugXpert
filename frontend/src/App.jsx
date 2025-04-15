import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  return (
    <Router>
      <nav>
        <Link to="/profile">Perfil</Link> | <Link to="/edit">Editar</Link> | <Link to="/register">Registrar</Link> | <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/profile" element={<Profile token={token} />} />
        <Route path="/edit" element={<EditProfile token={token} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
