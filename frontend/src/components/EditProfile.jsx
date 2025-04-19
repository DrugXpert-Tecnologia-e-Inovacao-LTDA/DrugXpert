import React, { useState, useEffect } from 'react';
import { updateUser, getUser } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import LoadingScreen from './LoadingScreen';

const EditProfile = ({ token }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState({
    username: '',
    email: '',
    profession: '',
    lab: '',
    is_student: false,
    profile_picture: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (token) {
      getUser(token)
        .then(res => {
          setForm({
            username: res.data.username || '',
            email: res.data.email || '',
            profession: res.data.profession || '',
            lab: res.data.lab || '',
            is_student: res.data.is_student || false,
            profile_picture: null
          });
          if (res.data.profile_picture_url) {
            setPreviewImage(res.data.profile_picture_url);
          }
          
          const hasProfession = res.data.profession && res.data.profession.trim() !== '';
          const hasLab = res.data.lab && res.data.lab.trim() !== '';
          setIsProfileIncomplete(!hasProfession || !hasLab);
          
          console.log('EditProfile - Profile status:', {
            profession: res.data.profession,
            lab: res.data.lab,
            hasProfession,
            hasLab,
            incomplete: !hasProfession || !hasLab
          });
          
          setInitialLoading(false);
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          setError('Não foi possível carregar os dados do usuário');
          setInitialLoading(false);
        });
    }
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profile_picture: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!form.username || !form.email || !form.profession || !form.lab) {
      setError('Por favor, preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'is_student') {
          formData.append(key, value.toString());
        } else if (key === 'profile_picture' && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'string') {
          formData.append(key, value.trim());
        } else {
          formData.append(key, value);
        }
      }
    });

    try {
      await updateUser(formData, token, false);
      setSuccess(true);
      
      localStorage.setItem('profileStatus', JSON.stringify({
        isComplete: true,
        lastCheck: new Date().toISOString()
      }));

      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Erro ao atualizar perfil. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 p-2 flex items-center justify-center">
      <div className="max-w-7xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in relative">
        <div className="md:flex relative z-10">
          <div className="md:w-1/3 bg-gradient-to-br from-green-500 to-green-700 p-4 text-white flex flex-col">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3">Seu Perfil</h2>
              <p className="text-white/80">Complete suas informações para ter acesso completo à plataforma DrugXpert.</p>
            </div>
            
            {isProfileIncomplete && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-white">Perfil Incompleto</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Os campos de Profissão e Laboratório são necessários para ter acesso completo à plataforma.
                </p>
              </div>
            )}
            
            <ul className="space-y-5 text-white/90 mt-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-3 mt-0.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium block">Foto de Perfil</span>
                  <span className="text-sm opacity-80">Adicione uma foto para personalizar seu perfil</span>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-3 mt-0.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium block">Informações Profissionais</span>
                  <span className="text-sm opacity-80">Complete seus dados para conectar com colegas da área</span>
                </div>
              </li>
            </ul>
            
            <div className="mt-auto pt-8">
              <Link 
                to="/profile" 
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para Perfil
              </Link>
              <Link 
                to="/home" 
                className="mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3m0 0L3 10m6-7l6 7" />
                </svg>
                Ir para Dashboard
              </Link>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Perfil</h2>
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 animate-fade-in flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>Perfil atualizado com sucesso!</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">

              <div className="mb-4 flex flex-col items-center">
                {previewImage ? (
                  <div className="relative inline-block group transition-transform transform hover:scale-105">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setPreviewImage('');
                        setForm({...form, profile_picture: null});
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-md transition-all"
                      title="Remover imagem"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 shadow-inner">
                    <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                
                <div className="mt-4">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile_picture"
                  />
                  <label 
                    htmlFor="profile_picture"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {previewImage ? 'Alterar imagem' : 'Adicionar foto'}
                  </label>
                </div>
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome de usuário <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="username"
                    type="text" 
                    placeholder="Seu nome de usuário" 
                    className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })} 
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="seu.email@exemplo.com" 
                    className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} 
                  />
                </div>
              </div>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-inner">
                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                    Profissão <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="profession"
                    type="text" 
                    placeholder="Ex: Farmacêutico, Pesquisador, Professor..." 
                    className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    value={form.profession}
                    onChange={e => setForm({ ...form, profession: e.target.value })} 
                  />
                  {isProfileIncomplete && !form.profession && (
                    <p className="mt-1 text-sm text-red-500">Este campo é obrigatório</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lab" className="block text-sm font-medium text-gray-700 mb-1">
                    Laboratório ou Instituição <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="lab"
                    type="text" 
                    placeholder="Nome do laboratório ou instituição onde trabalha" 
                    className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    value={form.lab}
                    onChange={e => setForm({ ...form, lab: e.target.value })} 
                  />
                  {isProfileIncomplete && !form.lab && (
                    <p className="mt-1 text-sm text-red-500">Este campo é obrigatório</p>
                  )}
                </div>
                
                <div className="flex items-center bg-white p-4 rounded-lg border border-gray-200">
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      id="is_student"
                      type="checkbox" 
                      className="sr-only peer"
                      checked={form.is_student}
                      onChange={e => setForm({ ...form, is_student: e.target.checked })} 
                    />
                    <div className={`relative w-11 h-6 ${form.is_student ? 'bg-green-600' : 'bg-gray-200'} peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    <span className="ml-3 font-medium text-gray-700">
                      Sou estudante
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/profile" 
                  className="sm:w-1/2 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 text-center hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </Link>
                <button 
                  type="submit" 
                  className={`sm:w-1/2 py-3 px-4 rounded-lg font-medium text-white 
                    ${loading ? 'bg-green-400' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'} 
                    transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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
              </div>
            </form>
            
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Mantenha seus dados atualizados para ter uma melhor experiência na plataforma.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
