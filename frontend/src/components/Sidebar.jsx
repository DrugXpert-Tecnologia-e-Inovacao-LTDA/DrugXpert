import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSyringe, FaPills, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  return (
    <div className="w-1/4 bg-gradient-to-br from-green-500 to-green-700 p-8 text-white flex flex-col shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link 
            to="/vaccines" 
            className="flex items-center px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <FaSyringe className="mr-3" />
            Vacinas
          </Link>
        </li>
        <li>
          <Link 
            to="/medicines" 
            className="flex items-center px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <FaPills className="mr-3" />
            Remédios
          </Link>
        </li>
        <li>
          <button 
            onClick={handleProfileClick}
            className="w-full flex items-center px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <FaUser className="mr-3" />
            Perfil
          </button>
        </li>
      </ul>
      <div className="mt-auto pt-8">
        <Link 
          to="/logout" 
          className="flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt className="mr-3" />
          Sair
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
