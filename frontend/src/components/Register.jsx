import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import '../index.css';

const Register = ({ setActiveTab }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '', re_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.re_password) {
      setError('As senhas não coincidem');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      setError('Erro ao registrar. Verifique se todos os campos estão corretos.');
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setActiveTab('login');
  };

  if (success) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-6">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Registro concluído!</h3>
        <p className="text-gray-600 mb-6">Sua conta foi criada com sucesso.</p>
        <button 
          onClick={switchToLogin}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Fazer login agora
          <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Nome de usuário
        </label>
        <input 
          id="username"
          type="text" 
          required
          placeholder="Nome de usuário" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, username: e.target.value })} 
        />
      </div>
      
      <div>
        <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input 
          id="registerEmail"
          type="email" 
          required
          placeholder="seu@email.com" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
        />
      </div>
      
      <div>
        <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input 
          id="registerPassword"
          type="password" 
          required
          placeholder="Crie uma senha" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirme a senha
        </label>
        <input 
          id="confirmPassword"
          type="password" 
          required
          placeholder="Repita sua senha" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, re_password: e.target.value })} 
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
          {loading ? 'Registrando...' : 'Criar conta'}
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Ao criar uma conta, você concorda com nossos
        <a href="#" className="text-green-600 hover:underline ml-1">
          Termos de Serviço
        </a>
      </div>
    </form>
  );
};

export default Register;
