import React, { useState } from 'react';
import { loginUser, getUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await loginUser(form);
      
      if (res.data && res.data.auth_token) {
        const token = res.data.auth_token;
        
        // Primeiro define no localStorage
        localStorage.setItem('token', token);
        // Depois atualiza o estado
        setToken(token);
        
        // Verificar completude do perfil
        try {
          const userData = await getUser(token);
          const { profession, lab } = userData.data;
          
          // Verifica explicitamente se os campos estão preenchidos
          // Strings vazias ('') serão consideradas valores incompletos
          const hasProfession = profession && profession.trim() !== '';
          const hasLab = lab && lab.trim() !== '';
          
          // Perfil completo apenas se ambos os campos estiverem preenchidos
          const profileComplete = hasProfession && hasLab;
          
          console.log('Login - Profile check:', { 
            profession,
            lab,
            hasProfession,
            hasLab,
            complete: profileComplete 
          });
          
          // Redirecionar com base na completude do perfil
          setTimeout(() => {
            if (profileComplete) {
              console.log('Redirecting to profile page');
              navigate('/profile');
            } else {
              console.log('Redirecting to edit profile page');
              navigate('/edit');
            }
          }, 100); // Pequeno delay para garantir que o estado foi atualizado
          
        } catch (profileErr) {
          console.error('Error checking profile:', profileErr);
          // Se não conseguir verificar o perfil, direciona para edição
          navigate('/edit');
        }
      } else {
        throw new Error('Token não recebido');
      }
    } catch (err) {
      console.error('Login error:', err);
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
