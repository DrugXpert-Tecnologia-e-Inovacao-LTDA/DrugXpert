import React, { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import { getUser, updateUser } from '../api/auth';
import { Link } from 'react-router-dom';
import { getDefaultAvatar } from '../utils/avatar';
import '../index.css';

const Profile = ({ token, onLogout }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState({
    username: false,
    profession: false,
    lab: false,
    is_student: false
  });
  const [formData, setFormData] = useState({
    username: '',
    profession: '',
    lab: '',
    is_student: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (token) {
      setLoading(true);
      getUser(token)
        .then(res => {
          setUser(res.data);
          setFormData({
            username: res.data.username || '',
            profession: res.data.profession || '',
            lab: res.data.lab || '',
            is_student: res.data.is_student || false
          });
          
          const isProfileComplete = !!(res.data.profession && res.data.lab);
          localStorage.setItem('profileStatus', JSON.stringify({
            isComplete: isProfileComplete,
            lastCheck: new Date().toISOString()
          }));
          
          setEditMode({
            username: false,
            profession: !res.data.profession,
            lab: !res.data.lab,
            is_student: false
          });
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          setError('Não foi possível carregar os dados do usuário');
          setLoading(false);
        });
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveChanges = async () => {
    if (!Object.keys(editMode).some(key => editMode[key])) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const changedData = {};
      Object.keys(editMode).forEach(key => {
        if (editMode[key] && formData[key] !== user[key]) {
          if (typeof formData[key] === 'string') {
            const trimmedValue = formData[key].trim();
            if (trimmedValue !== '') {
              changedData[key] = trimmedValue;
            }
          } else {
            changedData[key] = formData[key];
          }
        }
      });

      if (Object.keys(changedData).length === 0) {
        setError('Nenhuma alteração foi feita');
        return;
      }

      const response = await updateUser(changedData, token);
      setUser(prevUser => ({ ...prevUser, ...response.data }));
      setEditMode({
        username: false,
        profession: false,
        lab: false,
        is_student: false
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.username?.[0] || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Não foi possível atualizar o perfil';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditMode = (field) => {
    setEditMode({
      ...editMode,
      [field]: !editMode[field]
    });
  };

  if (pageLoading || loading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  const isAnyFieldInEditMode = Object.values(editMode).some(value => value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-green-500 opacity-5"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-green-500 opacity-5"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-green-500 opacity-5"></div>
        </div>
        
        <div className="md:flex relative z-10">
          <div className="md:w-1/3 bg-gradient-to-br from-green-500 to-green-700 p-8 text-white flex flex-col items-center justify-center">
            {user.profile_picture_url ? (
              <img 
                src={`http://127.0.0.1:8000${user.profile_picture_url}`} 
                alt="Perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transform transition-transform hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getDefaultAvatar(user.username);
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-green-600 text-3xl font-bold shadow-lg transform transition-transform hover:scale-105">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-2xl font-bold mt-6 text-center">Bem-vindo,</h2>
            <h1 className="text-3xl font-bold mb-2 text-center">{user.username}</h1>
            
            <div className="mt-8 w-full">
              <Link 
                to="/home"
                className="mt-4 w-full px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3m0 0L3 10m6-7l6 7" />
                </svg>
                Ir para Dashboard
              </Link>
              <button 
                onClick={onLogout}
                className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Informações Pessoais
                </h3>
                {saveSuccess && (
                  <div className="text-green-600 text-sm flex items-center animate-fade-in">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Perfil atualizado com sucesso!
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-gray-600 md:w-32 font-medium">Username:</span>
                  {editMode.username ? (
                    <div className="flex-1">
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Digite seu nome de usuário"
                          className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full max-w-xs`}
                        />
                        <button 
                          className="ml-2 text-green-600"
                          onClick={() => toggleEditMode('username')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {error && (
                        <p className="mt-1 text-sm text-red-500">{error}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-900 font-semibold">
                        {user.username || formData.username}
                      </span>
                      
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-gray-600 md:w-32 font-medium">Email:</span>
                  <span className="text-gray-900 font-semibold">{user.email}</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-gray-600 md:w-32 font-medium">Profissão:</span>
                  {editMode.profession ? (
                    <div className="flex flex-1 items-center">
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        placeholder="Digite sua profissão"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full max-w-xs"
                      />
                      <button 
                        className="ml-2 text-green-600"
                        onClick={() => toggleEditMode('profession')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-900 font-semibold">
                        {user.profession || formData.profession || 
                          <span className="text-gray-400 italic">Não informado</span>}
                      </span>
                      <button 
                        className="ml-2 text-green-600"
                        onClick={() => toggleEditMode('profession')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-gray-600 md:w-32 font-medium">Laboratório:</span>
                  {editMode.lab ? (
                    <div className="flex flex-1 items-center">
                      <input
                        type="text"
                        name="lab"
                        value={formData.lab}
                        onChange={handleInputChange}
                        placeholder="Digite seu laboratório"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full max-w-xs"
                      />
                      <button 
                        className="ml-2 text-green-600"
                        onClick={() => toggleEditMode('lab')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-900 font-semibold">
                        {user.lab || formData.lab || 
                          <span className="text-gray-400 italic">Não informado</span>}
                      </span>
                      <button 
                        className="ml-2 text-green-600"
                        onClick={() => toggleEditMode('lab')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-gray-600 md:w-32 font-medium">Estudante:</span>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_student"
                        checked={formData.is_student}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className={`relative w-11 h-6 ${formData.is_student ? 'bg-green-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      <span className="ml-3 text-gray-900 font-semibold">
                        {formData.is_student ? 'Sim' : 'Não'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3 justify-between">
              {isAnyFieldInEditMode && (
                <button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Salvar Alterações
                    </>
                  )}
                </button>
              )}
              
              <a 
                href="/edit" 
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar Perfil Completo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
