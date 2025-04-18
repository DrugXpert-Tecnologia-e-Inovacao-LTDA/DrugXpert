import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 flex">
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />
      {/* Main Content */}
      <div className="w-3/4 p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bem-vindo ao Dashboard</h1>
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisas sobre Vacinas</h2>
            <p className="text-gray-700">
              Explore as últimas pesquisas e avanços no desenvolvimento de vacinas. Conecte-se com outros pesquisadores e compartilhe informações.
            </p>
          </section>
          <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisas sobre Remédios</h2>
            <p className="text-gray-700">
              Descubra novos medicamentos e tratamentos. Acompanhe estudos clínicos e colabore com especialistas da área.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
