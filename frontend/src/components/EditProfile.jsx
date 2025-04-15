import React, { useState, useEffect } from 'react';
import { updateUser, getUser } from '../api/auth';
import { Link } from 'react-router-dom';
import '../index.css';

const EditProfile = ({ token }) => {
  const [form, setForm] = useState({
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

  useEffect(() => {
    // Carregar os dados atuais do usuário
    if (token) {
      getUser(token)
        .then(res => {
          setForm({
            profession: res.data.profession || '',
            lab: res.data.lab || '',
            is_student: res.data.is_student || false,
            profile_picture: null // Não podemos definir o arquivo aqui
          });
          if (res.data.profile_picture) {
            setPreviewImage(res.data.profile_picture);
          }
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
      
      // Criar preview da imagem
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
    
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      await updateUser(formData, token);
      setSuccess(true);
      setLoading(false);
      // Rolar para o topo para mostrar a mensagem de sucesso
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Update error:', err);
      setError('Erro ao atualizar perfil. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Editar Perfil</h2>
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center">
          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Perfil atualizado com sucesso!
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          {previewImage ? (
            <div className="relative inline-block">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500 mx-auto"
              />
              <button 
                type="button"
                onClick={() => {
                  setPreviewImage('');
                  setForm({...form, profile_picture: null});
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                title="Remover imagem"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mx-auto">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto de Perfil
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden"
              id="profile_picture"
            />
            <label 
              htmlFor="profile_picture"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Escolher imagem
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
            Profissão
          </label>
          <input 
            id="profession"
            type="text" 
            placeholder="Sua profissão" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.profession}
            onChange={e => setForm({ ...form, profession: e.target.value })} 
          />
        </div>
        
        <div>
          <label htmlFor="lab" className="block text-sm font-medium text-gray-700 mb-1">
            Laboratório ou Instituição
          </label>
          <input 
            id="lab"
            type="text" 
            placeholder="Nome do laboratório ou instituição" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.lab}
            onChange={e => setForm({ ...form, lab: e.target.value })} 
          />
        </div>
        
        <div className="flex items-center">
          <input 
            id="is_student"
            type="checkbox" 
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            checked={form.is_student}
            onChange={e => setForm({ ...form, is_student: e.target.checked })} 
          />
          <label htmlFor="is_student" className="ml-2 block text-sm text-gray-700">
            Sou estudante
          </label>
        </div>
        
        <div className="pt-4 flex space-x-4">
          <Link 
            to="/profile" 
            className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 text-center hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            className={`w-1/2 py-2 px-4 rounded-lg font-medium text-white 
              ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} 
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
