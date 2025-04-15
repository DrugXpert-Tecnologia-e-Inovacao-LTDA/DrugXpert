import React, { useState } from 'react';
import { registerUser } from '../api/auth';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', re_password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert('Registro realizado com sucesso!');
    } catch {
      alert('Erro ao registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
      <input placeholder="Email" type="email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="Senha" type="password" onChange={e => setForm({...form, password: e.target.value})} />
      <input placeholder="Repetir Senha" type="password" onChange={e => setForm({...form, re_password: e.target.value})} />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
