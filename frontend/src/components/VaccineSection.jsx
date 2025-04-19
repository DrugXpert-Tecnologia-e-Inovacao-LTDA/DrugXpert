import React from 'react';
import { FaSyringe, FaChartLine, FaUsers, FaBookMedical } from 'react-icons/fa';

const VaccineSection = () => {
  const features = [
    {
      icon: <FaSyringe className="text-3xl text-green-500" />,
      title: "Desenvolvimento de Vacinas",
      description: "Acompanhe as últimas inovações e pesquisas em desenvolvimento de vacinas."
    },
    {
      icon: <FaChartLine className="text-3xl text-green-500" />,
      title: "Análise de Dados",
      description: "Estatísticas e dados sobre eficácia e distribuição de vacinas."
    },
    {
      icon: <FaUsers className="text-3xl text-purple-500" />,
      title: "Colaboração",
      description: "Conecte-se com pesquisadores e especialistas da área."
    },
    {
      icon: <FaBookMedical className="text-3xl text-red-500" />,
      title: "Documentação",
      description: "Acesso a documentos e protocolos de pesquisa."
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden h-full animate-fade-in delay-700">
      <div className="p-6">
        <div className="text-center mb-8 animate-fade-in delay-700">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Centro de Pesquisas sobre Vacinas
          </h2>
          <p className="text-lg text-gray-600">
            Plataforma completa para pesquisadores e profissionais da área de desenvolvimento de vacinas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in delay-700">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-all duration-300">
              <div className="mb-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-green-50 rounded-xl p-4 animate-fade-in delay-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2">
              <div className="text-2xl font-bold text-green-600">150+</div>
              <div className="text-sm text-gray-600 mt-1">Pesquisas Ativas</div>
            </div>
            <div className="p-2">
              <div className="text-2xl font-bold text-green-600">2000+</div>
              <div className="text-sm text-gray-600 mt-1">Pesquisadores</div>
            </div>
            <div className="p-2">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600 mt-1">Laboratórios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccineSection;
