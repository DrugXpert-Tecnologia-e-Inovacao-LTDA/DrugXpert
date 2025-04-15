import React, { useEffect, useState } from 'react';
import { getUser } from '../api/auth';
import '../index.css';

const Profile = ({ token, onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setLoading(true);
      getUser(token)
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          setError('Não foi possível carregar os dados do usuário');
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 p-4 rounded-lg text-red-600">
      <p>{error}</p>
      <button 
        onClick={onLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
      >
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        Sair e tentar novamente
      </button>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        {user.profile_picture ? (
          <img 
            src={user.profile_picture} 
            alt="Perfil" 
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-green-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto bg-green-100 flex items-center justify-center text-green-500 text-xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className="text-2xl font-bold mt-4">Bem-vindo, {user.username}</h2>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-gray-600 w-24">Email:</span>
          <span className="text-gray-900">{user.email}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 w-24">Profissão:</span>
          <span className="text-gray-900">{user.profession || 'Não informado'}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 w-24">Laboratório:</span>
          <span className="text-gray-900">{user.lab || 'Não informado'}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 w-24">Estudante:</span>
          <span className="text-gray-900">{user.is_student ? 'Sim' : 'Não'}</span>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <a 
          href="/edit" 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Editar Perfil
        </a>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Profile;
