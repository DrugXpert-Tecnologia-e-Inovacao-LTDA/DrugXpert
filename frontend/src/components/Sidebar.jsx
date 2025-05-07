import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSyringe, FaPills, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { SiMoleculer } from "react-icons/si";
import { PiAtomBold } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";

const Sidebar = ({ onLogout, onSidebarStateChange }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
    onSidebarStateChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    onSidebarStateChange?.(false);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  const handleEditProfileClick = (e) => {
    e.preventDefault();
    navigate('/edit');
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-br from-green-500 to-green-700 p-4 text-white flex flex-col shadow-lg`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-6 flex justify-center">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className={`transition-all duration-300 ${isOpen ? 'w-12 h-12' : 'w-8 h-8'}`}
        />
      </div>
      <ul className="space-y-4">
        <li>
          <Link 
            to="/home" 
            className={`flex items-center px-4 py-3 bg-white/20 hover:bg-white text-white hover:text-green-500 rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
          >
            <FaHome size={20} />
            <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
              Home
            </span>
          </Link>
        </li>
        <li>
          <Link 
            to="/vaccines" 
            className={`flex items-center px-4 py-3 bg-white/20 hover:bg-white text-white hover:text-green-500 rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
          >
            <FaSyringe size={20} />
            <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
              Vaccines
            </span>
          </Link>
        </li>
        <li>
          <Link 
            to="/medicines" 
            className={`flex items-center px-4 py-3 bg-white/20 hover:bg-white text-white hover:text-green-500 rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
          >
            <FaPills size={20} />
            <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
              Medicines
            </span>
          </Link>
        </li>
        <li>
          <Link 
            to="/molecules" 
            className={`flex items-center px-4 py-3 bg-white/20 hover:bg-white text-white hover:text-green-500 rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
          >
            <FaPills size={20} />
            <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
              Molecules
            </span>
          </Link>
        </li>
        <li>
          <Link 
            to="/smiles" 
            className={`flex items-center px-4 py-3 bg-white/20 hover:bg-white text-white hover:text-green-500 rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
          >
            <FaPills size={20} />
            <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
              SMILES
            </span>
          </Link>
        </li>
        <li>
          <button 
            onClick={handleProfileClick}
            className={`w-full flex items-center px-4 py-3 bg-white/20 hover:bg-white text-white hover:text-green-500 rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
          >
            <FaUser size={20} />
            <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
              Profile
            </span>
          </button>
        </li>
        <li>
          <button 
            onClick={handleEditProfileClick}
            className={`w-full flex items-center px-4 py-3 bg-white/20 hover:bg-white text-white hover:text-green-500 rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
          >
            <IoMdSettings size={20} />
            <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
              Settings
            </span>
          </button>
        </li>
      </ul>
      <div className="mt-auto pt-8">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all shadow-md hover:shadow-lg ${isOpen ? '' : 'justify-center'}`}
        >
          <FaSignOutAlt size={20} />
          <span className={`transition-all duration-300 ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'}`}>
            Sair
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
