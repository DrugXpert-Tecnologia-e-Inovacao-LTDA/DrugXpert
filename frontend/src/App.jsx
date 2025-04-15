import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';

// Importação com lazy loading para melhor performance
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Profile = lazy(() => import('./components/Profile'));
const EditProfile = lazy(() => import('./components/EditProfile'));

// Loading spinner component para lazy loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-600 to-green-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-200 border-opacity-50"></div>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificação do token com um pequeno delay para simular carregamento
    const checkAuth = async () => {
      const stored = localStorage.getItem('token');
      if (stored) setToken(stored);
      
      // Simular um breve carregamento para uma melhor UX
      setTimeout(() => setIsLoading(false), 800);
    };
    
    checkAuth();
  }, []);

  // Função para limpar o token (logout)
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    // Feedback visual opcional quando faz logout
    window.location.href = '/';
  };

  // Landing page component with login and register
  const LandingPage = () => {
    const location = useLocation();
    
    useEffect(() => {
      if (location.state && location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
    }, [location]);

    // Efeito de movimento suave para os elementos da página
    const fadeInClass = "animate-fade-in";

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-green-900 p-4">
        <div className={`max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${fadeInClass}`}>
          
          {/* Left side - Branding - Agora com conteúdo melhorado */}
          <div className="md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 p-8 text-white flex flex-col justify-center relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-5"></div>
              <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white opacity-5"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-white opacity-5"></div>
            </div>
            
            <div className="relative z-10 mb-10">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6 transform transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-3 leading-tight">DrugXpert</h1>
              <p className="text-xl opacity-80 leading-relaxed">A plataforma completa para profissionais farmacêuticos.</p>
            </div>
            
            <ul className="space-y-5 text-white/90 relative z-10">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-3 mt-0.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium block">Banco de dados completo</span>
                  <span className="text-sm opacity-80">Acesso a informações detalhadas sobre milhares de medicamentos</span>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-3 mt-0.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium block">Comunidade exclusiva</span>
                  <span className="text-sm opacity-80">Conecte-se com outros profissionais da área farmacêutica</span>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-3 mt-0.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium block">Ferramentas avançadas</span>
                  <span className="text-sm opacity-80">Pesquisa, análise de interações e recursos de estudo</span>
                </div>
              </li>
            </ul>
            
            <div className="mt-10 py-4 border-t border-white/20 text-sm opacity-70 relative z-10">
              Mais de 5.000 profissionais já utilizam nossa plataforma para aprimorar seu conhecimento e prática.
            </div>
          </div>
          
          {/* Right side - Auth Forms */}
          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Bem-vindo(a) à DrugXpert</h2>
              <p className="text-gray-600 mt-1">Sua plataforma completa de conhecimento farmacêutico</p>
            </div>
            
            {/* Toggle Tabs - Improved styling */}
            <div className="flex border-b border-gray-200 mb-8">
              <button 
                onClick={() => setActiveTab('login')}
                className={`py-3 px-4 w-1/2 text-center font-medium transition-all duration-200 ${
                  activeTab === 'login' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => setActiveTab('register')}
                className={`py-3 px-4 w-1/2 text-center font-medium transition-all duration-200 ${
                  activeTab === 'register' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Registrar
              </button>
            </div>
            
            {/* Auth Forms with animation */}
            <div className="auth-forms flex-grow">
              <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>}>
                {activeTab === 'login' ? (
                  <div className="animate-fade-in">
                    <Login setToken={setToken} />
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <Register setActiveTab={setActiveTab} />
                  </div>
                )}
              </Suspense>
            </div>
            
            {/* Footer section */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>© 2023 DrugXpert. Todos os direitos reservados.</p>
              <div className="mt-2 space-x-3">
                <a href="#" className="hover:text-green-600 transition-colors">Termos</a>
                <a href="#" className="hover:text-green-600 transition-colors">Privacidade</a>
                <a href="#" className="hover:text-green-600 transition-colors">Suporte</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/profile" /> : <LandingPage />} />
          <Route path="/profile" element={
            token ? 
              <Profile token={token} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } />
          <Route path="/edit" element={
            token ? 
              <EditProfile token={token} /> : 
              <Navigate to="/" />
          } />
          <Route path="/login" element={
            token ? 
              <Navigate to="/profile" /> : 
              <Navigate to="/" state={{ activeTab: 'login' }} />
          } />
          <Route path="/register" element={
            token ? 
              <Navigate to="/profile" /> : 
              <Navigate to="/" state={{ activeTab: 'register' }} />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
