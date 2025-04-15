import React, { useState } from 'react';
import { loginUser } from '../api/auth';

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      setToken(res.data.auth_token);
      localStorage.setItem('token', res.data.auth_token);
      alert('Login feito com sucesso!');
    } catch {
      alert('Erro no login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Senha" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
