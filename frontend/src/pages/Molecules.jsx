import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import LoadingScreen from '../components/LoadingScreen';
import { getDefaultAvatar } from '../utils/avatar';
import { getUser } from '../api/auth';

const Molecules = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [sumMolA, setSumMolA] = useState('');
  const [sumMolB, setSumMolB] = useState('');
  const [sumResult, setSumResult] = useState(null);

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

  // Dados mockados adaptados para moléculas
  const mockData = {
    globalStats: {
      moleculesDiscovered: 350,
      researchCenters: 45,
      ongoingResearch: 120,
    },
    recentDiscoveries: [
      { year: 2024, molecule: "DXP-101", discoverer: "LabXpert", description: "Nova molécula com potencial anti-inflamatório." },
      { year: 2023, molecule: "Mol-Alpha", discoverer: "BioGen", description: "Molécula promissora para tratamento de câncer." },
      { year: 2023, molecule: "NanoCure", discoverer: "NanoLab", description: "Molécula nanoestruturada para regeneração celular." },
      { year: 2022, molecule: "ImmunoBoost", discoverer: "ImmunoTech", description: "Molécula que estimula o sistema imunológico." },
      { year: 2022, molecule: "NeuroDex", discoverer: "NeuroLab", description: "Molécula para doenças neurodegenerativas." },
    ],
    researchComponents: [
      { name: "Enzima QX-12", type: "Enzima", status: "Nova", description: "Catalisador para reações metabólicas." },
      { name: "Peptídeo Beta-7", type: "Peptídeo", status: "Nova", description: "Peptídeo sintético para terapias inovadoras." },
      { name: "Ligante L-202", type: "Ligante", status: "Nova", description: "Ligante para receptores celulares específicos." },
      { name: "Nanopartícula ZN-5", type: "Nanopartícula", status: "Nova", description: "Nanopartícula para entrega de fármacos." },
    ],
    ongoingResearch: [
      { project: "Molécula DXP-101 em ensaios clínicos", center: "LabXpert", expectedResult: "2025" },
      { project: "Estudo de estabilidade do Peptídeo Beta-7", center: "BioGen", expectedResult: "2024" },
      { project: "Aplicação de NanoCure em tecidos humanos", center: "NanoLab", expectedResult: "2025" },
      { project: "Testes pré-clínicos do ImmunoBoost", center: "ImmunoTech", expectedResult: "2024" },
    ],
  };

  const moleculeDisplayData = [
    {
      compoundId: "Amigdalin",
      esol: -0.974,
      minDegree: 1,
      molecularWeight: 457.432,
      hBondDonors: 7,
      rings: 3,
      rotatableBonds: 7,
      polarSurfaceArea: 202.32,
      measuredLogSol: -0.77,
      smiles: "N#CC(OC1OC(COC2OC(CO)C(O)C(O)C2O)C(O)C(O)C1O)C1:C:C:C:C:C:1"
    },
    {
      compoundId: "Fenfuram",
      esol: -2.885,
      minDegree: 1,
      molecularWeight: 201.225,
      hBondDonors: 1,
      rings: 2,
      rotatableBonds: 2,
      polarSurfaceArea: 42.24,
      measuredLogSol: -3.3,
      smiles: "CC1:O:C:C:C:1C(=O)NC1:C:C:C:C:C:1"
    },
    {
      compoundId: "citral",
      esol: -2.579,
      minDegree: 1,
      molecularWeight: 152.237,
      hBondDonors: 0,
      rings: 0,
      rotatableBonds: 4,
      polarSurfaceArea: 17.07,
      measuredLogSol: -2.06,
      smiles: "CC(C)=CCCC(C)=CC=O"
    },
    {
      compoundId: "Picene",
      esol: -6.618,
      minDegree: 2,
      molecularWeight: 278.354,
      hBondDonors: 0,
      rings: 5,
      rotatableBonds: 0,
      polarSurfaceArea: 0.0,
      measuredLogSol: -7.87,
      smiles: "C1:C:C:C2:C(:C:1):C:C:C1:C:2:C:C:C2:C3:C:C:C:C:C:3:C:C:C:2:1"
    },
    {
      compoundId: "Thiophene",
      esol: -2.232,
      minDegree: 2,
      molecularWeight: 84.143,
      hBondDonors: 0,
      rings: 1,
      rotatableBonds: 0,
      polarSurfaceArea: 0.0,
      measuredLogSol: -1.33,
      smiles: "C1:C:C:S:C:1"
    },
    {
      compoundId: "benzothiazole",
      esol: -2.733,
      minDegree: 2,
      molecularWeight: 135.191,
      hBondDonors: 0,
      rings: 2,
      rotatableBonds: 0,
      polarSurfaceArea: 12.89,
      measuredLogSol: -1.5,
      smiles: "C1:C:C:C2:S:C:N:C:2:C:1"
    },
    {
      compoundId: "2,2,4,6,6'-PCB",
      esol: -6.545,
      minDegree: 1,
      molecularWeight: 326.437,
      hBondDonors: 0,
      rings: 2,
      rotatableBonds: 1,
      polarSurfaceArea: 0.0,
      measuredLogSol: -7.32,
      smiles: "ClC1:C:C(Cl):C(C2:C(Cl):C:C:C:C:2Cl):C(Cl):C:1"
    },
    {
      compoundId: "Estradiol",
      esol: -4.138,
      minDegree: 1,
      molecularWeight: 272.388,
      hBondDonors: 2,
      rings: 4,
      rotatableBonds: 0,
      polarSurfaceArea: 40.46,
      measuredLogSol: -5.03,
      smiles: "CC12CCC3C4:C:C:C(O):C:C:4CCC3C1CCC2O"
    },
    {
      compoundId: "Dieldrin",
      esol: -4.533,
      minDegree: 1,
      molecularWeight: 380.913,
      hBondDonors: 0,
      rings: 5,
      rotatableBonds: 0,
      polarSurfaceArea: 12.53,
      measuredLogSol: -6.29,
      smiles: "ClC1=C(Cl)C2(Cl)C3C4CC(C5OC45)C3C1(Cl)C2(Cl)Cl"
    }
  ];

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
          pageTitle="Moléculas" 
          userImage={userData?.profile_picture_url ? 
            `http://127.0.0.1:8000${userData.profile_picture_url}` : 
            getDefaultAvatar(userData?.username)
          } // Added userImage prop
        />
        <main className="p-6 bg-gray-50 min-h-screen">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Descobertas e Pesquisas de Moléculas</h1>
            <p className="text-lg text-gray-600">
              Explore as moléculas mais recentes, componentes inovadores e pesquisas em andamento no mundo científico.
            </p>
          </header>

          <section id="global-stats" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Estatísticas Globais</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{mockData.globalStats.moleculesDiscovered}</div>
                <div className="text-sm text-gray-600">Moléculas Descobertas</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{mockData.globalStats.researchCenters}</div>
                <div className="text-sm text-gray-600">Centros de Pesquisa</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{mockData.globalStats.ongoingResearch}</div>
                <div className="text-sm text-gray-600">Pesquisas em Andamento</div>
              </div>
            </div>
          </section>

          <section id="recent-discoveries" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Descobertas Recentes de Moléculas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockData.recentDiscoveries.map((discovery, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">{discovery.molecule}</h3>
                  <p className="text-sm text-gray-600">
                    Descoberta por {discovery.discoverer} em {discovery.year}.
                  </p>
                  <p className="text-sm text-gray-700">{discovery.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="research-components" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Componentes de Pesquisas Novas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockData.researchComponents.map((component, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">{component.name}</h3>
                  <p className="text-sm text-gray-600"><strong>Tipo:</strong> {component.type}</p>
                  <p className="text-sm text-gray-600"><strong>Status:</strong> {component.status}</p>
                  <p className="text-sm text-gray-700">{component.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="ongoing-research" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisas em Andamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockData.ongoingResearch.map((research, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">{research.project}</h3>
                  <p className="text-sm text-gray-600"><strong>Centro:</strong> {research.center}</p>
                  <p className="text-sm text-gray-600"><strong>Previsão de Resultados:</strong> {research.expectedResult}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ferramenta de Pesquisa de Moléculas */}
          <section id="molecule-search" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisar Molécula</h2>
            <form
              className="flex flex-col md:flex-row items-center gap-4 mb-4"
              onSubmit={e => {
                e.preventDefault();
                const found = moleculeDisplayData.find(
                  mol => mol.compoundId.toLowerCase() === searchTerm.trim().toLowerCase()
                );
                setSelectedMolecule(found || null);
              }}
            >
              <input
                type="text"
                placeholder="Digite o nome da molécula (ex: Amigdalin)"
                className="border rounded-md px-3 py-2 w-full md:w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
              >
                Pesquisar
              </button>
            </form>
            {selectedMolecule ? (
              <div className="p-4 bg-white rounded-lg shadow mt-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedMolecule.compoundId}</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>ESOL logS:</strong> {selectedMolecule.esol}</li>
                  <li><strong>Min Degree:</strong> {selectedMolecule.minDegree}</li>
                  <li><strong>Peso Molecular:</strong> {selectedMolecule.molecularWeight}</li>
                  <li><strong>H-Bond Donors:</strong> {selectedMolecule.hBondDonors}</li>
                  <li><strong>Anéis:</strong> {selectedMolecule.rings}</li>
                  <li><strong>Ligações Rotativas:</strong> {selectedMolecule.rotatableBonds}</li>
                  <li><strong>Área de Superfície Polar:</strong> {selectedMolecule.polarSurfaceArea}</li>
                  <li><strong>Measured logS:</strong> {selectedMolecule.measuredLogSol}</li>
                  <li><strong>SMILES:</strong> <span className="break-all">{selectedMolecule.smiles}</span></li>
                </ul>
              </div>
            ) : searchTerm ? (
              <div className="text-red-600 mt-2">Molécula não encontrada.</div>
            ) : null}
          </section>

          {/* Ferramenta de Soma de Moléculas */}
          <section id="molecule-sum" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Somar Moléculas</h2>
            <form
              className="flex flex-col md:flex-row items-center gap-4 mb-4"
              onSubmit={e => {
                e.preventDefault();
                const molA = moleculeDisplayData.find(
                  mol => mol.compoundId.toLowerCase() === sumMolA.trim().toLowerCase()
                );
                const molB = moleculeDisplayData.find(
                  mol => mol.compoundId.toLowerCase() === sumMolB.trim().toLowerCase()
                );
                if (molA && molB) {
                  setSumResult({
                    name: `${molA.compoundId} + ${molB.compoundId}`,
                    smiles: `${molA.smiles}.${molB.smiles}`
                  });
                } else {
                  setSumResult('notfound');
                }
              }}
            >
              <input
                type="text"
                placeholder="Molécula A (ex: Amigdalin)"
                className="border rounded-md px-3 py-2 w-full md:w-64"
                value={sumMolA}
                onChange={e => setSumMolA(e.target.value)}
              />
              <span className="font-bold">+</span>
              <input
                type="text"
                placeholder="Molécula B (ex: Fenfuram)"
                className="border rounded-md px-3 py-2 w-full md:w-64"
                value={sumMolB}
                onChange={e => setSumMolB(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
              >
                Somar
              </button>
            </form>
            {sumResult === 'notfound' ? (
              <div className="text-red-600 mt-2">Uma ou ambas as moléculas não foram encontradas.</div>
            ) : sumResult ? (
              <div className="p-4 bg-white rounded-lg shadow mt-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{sumResult.name}</h3>
                <div>
                  <strong>SMILES resultante:</strong>
                  <div className="break-all text-sm mt-1">{sumResult.smiles}</div>
                </div>
              </div>
            ) : null}
          </section>

          {/* Display de Moléculas */}
          <section id="molecule-display" className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Display de Moléculas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-2 border">Compound ID</th>
                    <th className="px-2 py-2 border">ESOL logS</th>
                    <th className="px-2 py-2 border">Min Degree</th>
                    <th className="px-2 py-2 border">Mol. Weight</th>
                    <th className="px-2 py-2 border">H-Bond Donors</th>
                    <th className="px-2 py-2 border">Rings</th>
                    <th className="px-2 py-2 border">Rotatable Bonds</th>
                    <th className="px-2 py-2 border">Polar Surface Area</th>
                    <th className="px-2 py-2 border">Measured logS</th>
                    <th className="px-2 py-2 border">SMILES</th>
                  </tr>
                </thead>
                <tbody>
                  {moleculeDisplayData.map((mol, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="px-2 py-1 border">{mol.compoundId}</td>
                      <td className="px-2 py-1 border">{mol.esol}</td>
                      <td className="px-2 py-1 border">{mol.minDegree}</td>
                      <td className="px-2 py-1 border">{mol.molecularWeight}</td>
                      <td className="px-2 py-1 border">{mol.hBondDonors}</td>
                      <td className="px-2 py-1 border">{mol.rings}</td>
                      <td className="px-2 py-1 border">{mol.rotatableBonds}</td>
                      <td className="px-2 py-1 border">{mol.polarSurfaceArea}</td>
                      <td className="px-2 py-1 border">{mol.measuredLogSol}</td>
                      <td className="px-2 py-1 border break-all">{mol.smiles}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Molecules;
