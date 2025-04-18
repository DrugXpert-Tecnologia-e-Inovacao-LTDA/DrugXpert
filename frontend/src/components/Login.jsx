import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getUser } from '../api/auth';
import '../index.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginResponse = await loginUser(credentials);
      const token = loginResponse.data.auth_token;

      const userResponse = await getUser(token);
      const user = userResponse.data;

      onLogin(token); // Ensure this is called with the token

      const isProfileComplete = !!(user.profession && user.lab);
      if (!isProfileComplete) {
        navigate('/edit');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error('Login error:', err);
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
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} 
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
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
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
