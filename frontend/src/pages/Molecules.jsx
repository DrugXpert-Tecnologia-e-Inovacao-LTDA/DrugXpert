import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import LoadingScreen from '../components/LoadingScreen'; // Import LoadingScreen
import { getDefaultAvatar } from '../utils/avatar'; // Import getDefaultAvatar
import { getUser } from '../api/auth'; // Import getUser

const Molecules = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser(token) // Fetch user data
        .then(response => {
          setUserData(response.data); // Set user data
          setIsLoading(false); // Stop loading after data is fetched
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error);
          setIsLoading(false); // Stop loading on error
        });
    } else {
      setIsLoading(false); // Stop loading if no token
    }
  }, []);

  const mockData = {
    globalStats: {
      vaccinesDeveloped: 120,
      countriesInvolved: 80,
      ongoingTrials: 300,
    },
    discoveries: [
      { year: 1796, vaccine: "Smallpox", discoverer: "Edward Jenner" },
      { year: 1885, vaccine: "Rabies", discoverer: "Louis Pasteur" },
      { year: 1955, vaccine: "Polio", discoverer: "Jonas Salk" },
      { year: 1967, vaccine: "Mumps", discoverer: "Maurice Hilleman" },
      { year: 1980, vaccine: "Hepatitis B", discoverer: "Baruch Blumberg" },
    ],
    mapData: [
      { country: "USA", vaccinesDeveloped: 40, flag: "us.svg" },
      { country: "UK", vaccinesDeveloped: 20, flag: "gb-eng.svg" },
      { country: "India", vaccinesDeveloped: 30, flag: "in.svg" },
      { country: "Germany", vaccinesDeveloped: 15, flag: "de.svg" },
      { country: "China", vaccinesDeveloped: 25, flag: "cn.svg" },
    ],
    recentDiscoveries: [
      { lab: "Pfizer", discovery: "Nova vacina contra variantes", year: 2023, flag: "us.svg" },
      { lab: "Moderna", discovery: "Vacina de RNA mensageiro aprimorada", year: 2022, flag: "us.svg" },
      { lab: "AstraZeneca", discovery: "Vacina combinada para gripe e COVID-19", year: 2023, flag: "gb-eng.svg" },
      { lab: "Sinovac", discovery: "Vacina inativada para COVID-19", year: 2021, flag: "cn.svg" },
      { lab: "Johnson & Johnson", discovery: "Vacina de dose única para COVID-19", year: 2021, flag: "us.svg" },
    ],
    universityStudies: [
      { university: "Harvard", study: "Eficácia de vacinas em idosos", year: 2023, flag: "us.svg" },
      { university: "Oxford", study: "Vacinas de próxima geração", year: 2022, flag: "gb-eng.svg" },
      { university: "Stanford", study: "Impacto de vacinas em doenças raras", year: 2023, flag: "us.svg" },
      { university: "MIT", study: "Vacinas baseadas em nanotecnologia", year: 2023, flag: "us.svg" },
      { university: "Cambridge", study: "Vacinas para doenças negligenciadas", year: 2022, flag: "gb-eng.svg" },
    ],
    vaccineDetails: [
      {
        name: "Vacina BCG",
        disease: "Tuberculose",
        createdBy: "Albert Calmette e Camille Guérin",
        lab: "Instituto Pasteur",
        country: "França",
        creationMethod: "Bactéria atenuada",
        description: "Protege contra formas graves de tuberculose, especialmente em crianças.",
      },
      {
        name: "Vacina contra COVID-19 (Pfizer-BioNTech)",
        disease: "COVID-19",
        createdBy: "Pfizer e BioNTech",
        lab: "Pfizer-BioNTech",
        country: "EUA e Alemanha",
        creationMethod: "RNA mensageiro",
        description: "Previne infecções graves causadas pelo vírus SARS-CoV-2.",
      },
      {
        name: "Vacina contra Poliomielite",
        disease: "Poliomielite",
        createdBy: "Jonas Salk",
        lab: "Universidade de Pittsburgh",
        country: "EUA",
        creationMethod: "Vírus inativado",
        description: "Previne a poliomielite, uma doença que pode causar paralisia.",
      },
      {
        name: "Vacina contra Sarampo",
        disease: "Sarampo",
        createdBy: "John Enders",
        lab: "Children's Hospital Boston",
        country: "EUA",
        creationMethod: "Vírus atenuado",
        description: "Previne o sarampo, uma doença altamente contagiosa.",
      },
      {
        name: "Vacina contra HPV",
        disease: "Papilomavírus Humano",
        createdBy: "Ian Frazer",
        lab: "University of Queensland",
        country: "Austrália",
        creationMethod: "Partículas semelhantes ao vírus",
        description: "Previne infecções por HPV e cânceres associados.",
      },
    ],
  };

  const handleSimulation = (researchBudget, scientists, duration) => {
    const effectiveness = Math.min(
      100,
      Math.round((researchBudget * 0.1 + scientists * 0.5 + duration * 2) / 10)
    );
    setSimulationResult({
      researchBudget,
      scientists,
      duration,
      effectiveness,
    });
  };

  if (isLoading) {
    return <LoadingScreen />; // Show LoadingScreen while loading
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 flex">
      <Sidebar onSidebarStateChange={setIsSidebarOpen} />
      <div 
        className={`flex-grow transition-all duration-300 p-8 bg-gray-100`} 
        style={{ marginLeft: isSidebarOpen ? '16rem' : '5rem' }}
      >
        <NavBar 
          userName={userData?.username || 'Usuário'}
          pageTitle="Molecules" 
          userImage={userData?.profile_picture_url ? 
            `http://127.0.0.1:8000${userData.profile_picture_url}` : 
            getDefaultAvatar(userData?.username)
          } // Added userImage prop
        />
        <main className="p-6 bg-gray-50 min-h-screen">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pesquisa e Desenvolvimento de Vacinas</h1>
            <p className="text-lg text-gray-600">
              Explore informações detalhadas sobre o progresso global no desenvolvimento de vacinas.
            </p>
          </header>

          <section id="global-stats" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Estatísticas Globais</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{mockData.globalStats.vaccinesDeveloped}</div>
                <div className="text-sm text-gray-600">Vacinas Desenvolvidas</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{mockData.globalStats.countriesInvolved}</div>
                <div className="text-sm text-gray-600">Países Envolvidos</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{mockData.globalStats.ongoingTrials}</div>
                <div className="text-sm text-gray-600">Testes em Andamento</div>
              </div>
            </div>
          </section>

          <section id="historical-discoveries" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Descobertas Históricas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockData.discoveries.map((discovery, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">{discovery.vaccine}</h3>
                  <p className="text-sm text-gray-600">
                    Descoberto por {discovery.discoverer} em {discovery.year}.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="global-distribution" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Distribuição Global</h2>
            <div className="grid grid-cols-3 gap-4">
              {mockData.mapData.map((data, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow text-center">
                  <img
                    src={`/flags/${data.flag}`}
                    alt={`Bandeira de ${data.country}`}
                    className="w-16 h-10 mx-auto mb-2"
                  />
                  <h3 className="text-lg font-medium text-gray-900">{data.country}</h3>
                  <p className="text-sm text-gray-600">
                    {data.vaccinesDeveloped} vacinas desenvolvidas
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="tools-section" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ferramentas e Descobertas</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Estudos em Universidades */}
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Estudos em Universidades</h3>
                <ul className="space-y-4">
                  {mockData.universityStudies.map((study, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`/flags/${study.flag}`}
                          alt={`Bandeira de ${study.university}`}
                          className="w-8 h-5"
                        />
                        <h4 className="text-lg font-medium text-gray-900">{study.university}</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {study.study} ({study.year})
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Descobertas Recentes de Laboratórios */}
              <div className="p-4 bg-white rounded-lg shadow animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Descobertas Recentes de Laboratórios</h3>
                <ul className="space-y-4">
                  {mockData.recentDiscoveries.map((discovery, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`/flags/${discovery.flag}`}
                          alt={`Bandeira do laboratório ${discovery.lab}`}
                          className="w-8 h-5"
                        />
                        <h4 className="text-lg font-medium text-gray-900">{discovery.lab}</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {discovery.discovery} ({discovery.year})
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ferramenta de Simulação de Vacinas */}
              <div className="p-4 bg-white rounded-lg shadow animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ferramenta de Simulação de Vacinas</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleSimulation(
                      parseInt(formData.get("budget")),
                      parseInt(formData.get("scientists")),
                      parseInt(formData.get("duration"))
                    );
                  }}
                >
                  <div className="grid grid-cols-3 gap-4 mb-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Orçamento (em milhões)</label>
                      <input
                        type="number"
                        name="budget"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Número de Cientistas</label>
                      <input
                        type="number"
                        name="scientists"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duração (em meses)</label>
                      <input
                        type="number"
                        name="duration"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                  >
                    Simular
                  </button>
                </form>
                {simulationResult && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900">Resultado da Simulação</h4>
                    <p className="text-sm text-gray-600">
                      Orçamento: {simulationResult.researchBudget} milhões
                    </p>
                    <p className="text-sm text-gray-600">
                      Cientistas: {simulationResult.scientists}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duração: {simulationResult.duration} meses
                    </p>
                    <p className="text-sm text-gray-600 font-bold">
                      Eficácia Estimada: {simulationResult.effectiveness}%
                    </p>
                  </div>
                )}
              </div>

              {/* Ferramenta de Composição de Vacinas */}
              <div className="p-4 bg-white rounded-lg shadow animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ferramenta de Composição de Vacinas</h3>
                <ul className="space-y-4">
                  {mockData.vaccineDetails.map((vaccine, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                      <h4 className="text-lg font-medium text-gray-900">{vaccine.name}</h4>
                      <p className="text-sm text-gray-600">
                        <strong>Doença:</strong> {vaccine.disease}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Criado por:</strong> {vaccine.createdBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Laboratório:</strong> {vaccine.lab}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>País:</strong> {vaccine.country}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Método de Criação:</strong> {vaccine.creationMethod}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Descrição:</strong> {vaccine.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Molecules;
