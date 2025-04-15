import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import '../index.css';

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await loginUser(form);
      console.log('Login response:', res); // Debug para verificar a resposta
      
      if (res.data && res.data.auth_token) {
        // Primeiro define no localStorage
        localStorage.setItem('token', res.data.auth_token);
        // Depois atualiza o estado
        setToken(res.data.auth_token);
        console.log('Token set:', res.data.auth_token); // Debug para confirmar o token
      } else {
        throw new Error('Token não recebido');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug do erro
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input 
          id="email"
          type="email" 
          required
          placeholder="seu@email.com" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input 
          id="password"
          type="password" 
          required
          placeholder="Sua senha" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
        />
      </div>
      
      <div className="pt-2">
        <button 
          type="submit" 
          className={`w-full py-2 px-4 rounded-lg font-medium text-white 
            ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} 
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
      
      <div className="text-center mt-4">
        <a href="#" className="text-sm text-green-600 hover:underline">
          Esqueceu sua senha?
        </a>
      </div>
    </form>
  );
};

export default Login;
