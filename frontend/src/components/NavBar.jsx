import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NavBar = ({ userName = "Usuário", pageTitle = "Dashboard", userImage }) => { // Added userImage prop
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onLogout = () => {
    localStorage.clear(); // Limpa todo o localStorage
    navigate('/'); // Redireciona para a rota raiz, que deve ser a página de login
    window.location.reload(); // Força o recarregamento da página para limpar o estado
  };

  return (
    <nav className="bg-white shadow-lg p-4 mb-6 rounded-lg flex items-center justify-between animate-fade-in delay-700">
      <div className="flex items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Bem-vindo ao {pageTitle}, {userName}!
        </h1>
      </div>
      
      <div className="w-1/3 ml-auto mr-4 animate-fade-in delay-700"> {/* Modificado: removido mx-8 e adicionado ml-auto mr-4 */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center space-x-4 animate-fade-in delay-700">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        <div className="relative" ref={dropdownRef}>
          <Link 
            to="/profile"
            className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500 block"
          >
            <img
              src={userImage || "https://via.placeholder.com/40"} // Use userImage prop
              alt="Foto do usuário"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;