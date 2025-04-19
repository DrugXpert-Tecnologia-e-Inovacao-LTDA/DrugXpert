import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api/auth';
import { getDefaultAvatar } from '../utils/avatar';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import VaccineSection from '../components/VaccineSection';
import MedicineSection from '../components/MedicineSection';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser(token)
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 flex">
      <Sidebar onLogout={onLogout} onSidebarStateChange={setIsSidebarOpen} />
      <div className="flex-grow transition-all duration-300 p-8 bg-gray-100">
        <NavBar 
          userName={userData?.username || 'Usuário'} 
          userImage={userData?.profile_picture_url ? 
            `http://127.0.0.1:8000${userData.profile_picture_url}` : 
            getDefaultAvatar(userData?.username)
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <VaccineSection />
          <MedicineSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
