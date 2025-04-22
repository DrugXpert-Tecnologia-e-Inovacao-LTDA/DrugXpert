import React from 'react';
import { FaSearch, FaPills, FaClipboardCheck, FaUserMd } from 'react-icons/fa';

const MedicineSection = () => {
  const features = [
    {
      icon: <FaSearch className="w-8 h-8 text-blue-500" />,
      title: "Pesquisa Avançada",
      description: "Busca detalhada por nome, princípio ativo ou categoria terapêutica"
    },
    {
      icon: <FaPills className="w-8 h-8 text-purple-500" />,
      title: "Banco de Medicamentos",
      description: "Acesso a informações sobre mais de 10.000 medicamentos registrados"
    },
    {
      icon: <FaClipboardCheck className="w-8 h-8 text-indigo-500" />,
      title: "Estudos Clínicos",
      description: "Acompanhe as últimas pesquisas e desenvolvimento de novos medicamentos"
    },
    {
      icon: <FaUserMd className="w-8 h-8 text-red-500" />,
      title: "Suporte Especializado",
      description: "Conecte-se com profissionais da área farmacêutica"
    }
  ];

  return (
    <section className="bg-gray-50 to-white rounded-lg overflow-hidden h-full animate-fade-in delay-700">
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Centro de Pesquisas Farmacêuticas</h2>
          <p className="text-lg text-gray-600">
            Explore nossa base de conhecimento completa sobre medicamentos e descobertas farmacêuticas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in delay-700">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center animate-fade-in delay-700">
          <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-300 font-semibold text-sm">
            Explorar Medicamentos
          </button>
        </div>
      </div>
    </section>
  );
};

export default MedicineSection;
