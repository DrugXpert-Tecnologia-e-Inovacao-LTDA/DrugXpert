// Register.jsx
import React, { useState } from 'react';
import api from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();
    await api.post('/register/', { email, password });
    alert('Registrado com sucesso!');
  };

  return (
    <form onSubmit={register}>
      <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Senha" />
      <button type="submit">Registrar</button>
    </form>
  );
}
