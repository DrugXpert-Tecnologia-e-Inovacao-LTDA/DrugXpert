import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import VaccineSection from '../components/VaccineSection';
import MedicineSection from '../components/MedicineSection';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 flex">
      <Sidebar onLogout={onLogout} onSidebarStateChange={setIsSidebarOpen} />
      <div className="flex-grow transition-all duration-300 p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bem-vindo ao Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <VaccineSection />
          <MedicineSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
