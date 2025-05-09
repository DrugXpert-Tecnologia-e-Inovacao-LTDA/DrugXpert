import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import LoadingScreen from '../components/LoadingScreen';
import { getDefaultAvatar } from '../utils/avatar';
import { getUser } from '../api/auth';

const Medicines = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    disease: '',
    description: '',
    manufacturer: '',
  });
  const [simulationResult, setSimulationResult] = useState(null);
  const [interactionAnalysis, setInteractionAnalysis] = useState([]);
  const [interactionCalled, setInteractionCalled] = useState(false);
  const [simulationStages, setSimulationStages] = useState({
    computer: null,
    animal: null,
    human: null,
  });
  const [interactionHistory, setInteractionHistory] = useState([]);

  const medicineSuggestions = ['Paracetamol', 'Ibuprofeno', 'Amoxicilina', 'Aspirina', 'Dipirona'];
  const numberSuggestions = [10, 20, 50, 100, 200];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser(token)
        .then(response => {
          setUserData(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mock de medicamentos e pesquisas pré-pesquisados
    const initialMedicines = [
      {
        name: 'Paracetamol',
        disease: 'Febre e Dor',
        description: 'Medicamento utilizado para aliviar dores leves a moderadas e reduzir febre.',
        manufacturer: 'Farmacêutica XYZ',
        chemicalProperties: {
          formula: 'C8H9NO2',
          molecularWeight: '151.16 g/mol',
          solubility: 'Solúvel em água',
          meltingPoint: '169°C',
        },
      },
      {
        name: 'Ibuprofeno',
        disease: 'Inflamação e Dor',
        description: 'Anti-inflamatório não esteroidal usado para tratar dor e inflamação.',
        manufacturer: 'Laboratório ABC',
        chemicalProperties: {
          formula: 'C13H18O2',
          molecularWeight: '206.28 g/mol',
          solubility: 'Pouco solúvel em água',
          meltingPoint: '76°C',
        },
      },
      {
        name: 'Amoxicilina',
        disease: 'Infecções Bacterianas',
        description: 'Antibiótico usado para tratar uma ampla gama de infecções bacterianas.',
        manufacturer: 'BioPharma Ltda',
        chemicalProperties: {
          formula: 'C16H19N3O5S',
          molecularWeight: '365.4 g/mol',
          solubility: 'Solúvel em água',
          meltingPoint: '195°C',
        },
      },
    ];

    const initialResearches = [
      {
        title: 'Estudo sobre a eficácia do Paracetamol em crianças',
        description: 'Pesquisa realizada para avaliar a segurança e eficácia do Paracetamol em crianças com febre.',
        year: 2022,
        institution: 'Universidade de Medicina de São Paulo',
      },
      {
        title: 'Impacto do Ibuprofeno em pacientes com artrite',
        description: 'Estudo clínico para analisar os efeitos do Ibuprofeno em pacientes com artrite reumatoide.',
        year: 2021,
        institution: 'Instituto Nacional de Saúde',
      },
      {
        title: 'Desenvolvimento de novas formulações de Amoxicilina',
        description: 'Pesquisa focada em melhorar a biodisponibilidade da Amoxicilina.',
        year: 2023,
        institution: 'Centro de Pesquisa BioTech',
      },
    ];

    setMedicines(initialMedicines);
    setSearchResults(initialMedicines); // Exibir medicamentos iniciais na pesquisa
  }, []);

  useEffect(() => {
    // Mock de interações medicamentosas
    const interactionMock = [
      { pair: ['Paracetamol', 'Álcool'], effect: 'Pode causar danos ao fígado', severity: 'Alta', recommendation: 'Evitar o uso combinado.' },
      { pair: ['Ibuprofeno', 'Aspirina'], effect: 'Aumenta o risco de sangramento', severity: 'Alta', recommendation: 'Consultar um médico antes de usar ambos.' },
      { pair: ['Amoxicilina', 'Anticoncepcionais'], effect: 'Reduz a eficácia dos anticoncepcionais', severity: 'Média', recommendation: 'Usar métodos contraceptivos adicionais.' },
      { pair: ['Dipirona', 'Álcool'], effect: 'Pode potencializar efeitos sedativos', severity: 'Média', recommendation: 'Evitar consumir álcool durante o tratamento.' },
      { pair: ['Paracetamol', 'Ibuprofeno'], effect: 'Uso combinado pode sobrecarregar os rins', severity: 'Alta', recommendation: 'Evitar o uso simultâneo sem orientação médica.' },
      { pair: ['Aspirina', 'Varfarina'], effect: 'Aumenta o risco de hemorragias', severity: 'Crítica', recommendation: 'Contraindicado sem supervisão médica.' },
      { pair: ['Metformina', 'Cimetidina'], effect: 'Pode aumentar os níveis de metformina no sangue', severity: 'Média', recommendation: 'Monitorar níveis de glicose e ajustar a dose se necessário.' },
    ];

    setInteractionAnalysis(interactionMock);
  }, []);

  const handleSearch = (query) => {
    setSearchCalled(true); // Marcar que a pesquisa foi chamada
    const results = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, newMedicine]);
    setNewMedicine({ name: '', disease: '', description: '', manufacturer: '' });
  };

  const handleSimulation = (budget, researchers, duration, type) => {
    const baseEffectiveness = Math.min(
      100,
      Math.round((budget * 0.2 + researchers * 0.5 + duration * 1.5) / 10)
    );
    const typeModifiers = {
      basic: 0,
      advanced: 10,
      clinical: 20,
    };
    const effectiveness = Math.min(100, baseEffectiveness + (typeModifiers[type] || 0));
    const details = {
      basic: 'Simulação básica com dados limitados.',
      advanced: 'Simulação avançada com modelos preditivos.',
      clinical: 'Simulação clínica com dados reais de pacientes.',
    };
    setSimulationResult({
      budget,
      researchers,
      duration,
      type,
      effectiveness,
      details: details[type] || 'Detalhes não disponíveis.',
    });
  };

  const analyzeInteractions = (medicine1, medicine2) => {
    setInteractionCalled(true); // Marcar que a análise foi chamada
    const interactions = [
      { pair: ['Aspirina', 'Ibuprofeno'], effect: 'Aumenta o risco de sangramento' },
      { pair: ['Paracetamol', 'Álcool'], effect: 'Pode causar danos ao fígado' },
    ];
    const result = interactions.find(
      interaction =>
        interaction.pair.includes(medicine1) && interaction.pair.includes(medicine2)
    );

    const analysisResult = result
      ? [result]
      : [
          { pair: [medicine1, medicine2], effect: 'Nenhuma interação encontrada', severity: 'Baixa', recommendation: 'Uso seguro.' },
        ];

    setInteractionAnalysis(analysisResult);
    setInteractionHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, { medicine1, medicine2, result: analysisResult }];
      return updatedHistory.slice(-2); // Manter apenas as duas consultas mais recentes
    });
  };

  const handleMedicineSimulation = (stage, successRate) => {
    const isApproved = Math.random() * 100 <= successRate;
    const reasons = {
      computer: isApproved
        ? 'Simulação computacional bem-sucedida com base em modelos preditivos e análise de dados moleculares.'
        : 'Falha na simulação computacional devido a inconsistências nos dados ou incompatibilidade molecular.',
      animal: isApproved
        ? 'Testes em animais indicaram eficácia e segurança aceitáveis, sem efeitos colaterais graves.'
        : 'Reprovação devido a toxicidade elevada ou efeitos colaterais graves observados em animais.',
      human: isApproved
        ? 'Testes clínicos em humanos demonstraram eficácia, segurança e tolerância em diferentes grupos demográficos.'
        : 'Reprovação devido a reações adversas severas, baixa eficácia ou incompatibilidade com populações específicas.',
    };
    setSimulationStages((prev) => ({
      ...prev,
      [stage]: { result: isApproved ? 'Aprovado' : 'Reprovado', reason: reasons[stage] },
    }));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex">
      <Sidebar onSidebarStateChange={setIsSidebarOpen} />
      <div
        className={`flex-grow transition-all duration-300 p-8 bg-gray-100`}
        style={{ marginLeft: isSidebarOpen ? '16rem' : '5rem' }}
      >
        <NavBar
          userName={userData?.username || 'Usuário'}
          pageTitle="Medicines"
          userImage={userData?.profile_picture_url
            ? `http://127.0.0.1:8000${userData.profile_picture_url}`
            : getDefaultAvatar(userData?.username)}
        />
        <main className="p-6 bg-gray-50 min-h-screen">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Medicamentos</h1>
            <p className="text-lg text-gray-600">
              Explore, pesquise e adicione novos medicamentos ao sistema.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Ferramenta de Pesquisa */}
            <section id="search-medicines" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisar Medicamentos</h2>
              <input
                type="text"
                placeholder="Digite o nome do medicamento..."
                className="w-full p-2 border rounded-md"
                list="medicine-suggestions"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <datalist id="medicine-suggestions">
                {medicineSuggestions.map((medicine, index) => (
                  <option key={index} value={medicine} />
                ))}
              </datalist>
              <div className="mt-4">
                {searchCalled && searchResults.length > 0 ? (
                  <ul className="space-y-4">
                    {searchResults.map((medicine, index) => (
                      <li key={index} className="p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900">{medicine.name}</h3>
                        <p className="text-sm text-gray-600">
                          <strong>Doença:</strong> {medicine.disease}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Descrição:</strong> {medicine.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Fabricante:</strong> {medicine.manufacturer}
                        </p>
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                          <h4 className="text-md font-bold text-gray-800">Propriedades Químicas</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Fórmula:</strong> {medicine.chemicalProperties.formula}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Peso Molecular:</strong> {medicine.chemicalProperties.molecularWeight}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Solubilidade:</strong> {medicine.chemicalProperties.solubility}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Ponto de Fusão:</strong> {medicine.chemicalProperties.meltingPoint}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : searchCalled && (
                  <p className="text-sm text-gray-600">Nenhum medicamento encontrado.</p>
                )}
              </div>
            </section>

            {/* Ferramenta de Adição */}
            <section id="add-medicine" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Adicionar Novo Medicamento</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddMedicine();
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Doença</label>
                    <input
                      type="text"
                      value={newMedicine.disease}
                      onChange={(e) => setNewMedicine({ ...newMedicine, disease: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      value={newMedicine.description}
                      onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fabricante</label>
                    <input
                      type="text"
                      value={newMedicine.manufacturer}
                      onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                >
                  Adicionar Medicamento
                </button>
              </form>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Ferramenta de Simulação de Eficácia */}
            <section id="simulation-tool" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Simulação de Eficácia</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleSimulation(
                    parseInt(formData.get("budget")),
                    parseInt(formData.get("researchers")),
                    parseInt(formData.get("duration")),
                    formData.get("type")
                  );
                }}
              >
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Orçamento (em milhões)</label>
                    <input
                      type="number"
                      name="budget"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      list="number-suggestions"
                      required
                    />
                    <datalist id="number-suggestions">
                      {numberSuggestions.map((number, index) => (
                        <option key={index} value={number} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pesquisadores</label>
                    <input
                      type="number"
                      name="researchers"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Simulação</label>
                    <select
                      name="type"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    >
                      <option value="basic">Básica</option>
                      <option value="advanced">Avançada</option>
                      <option value="clinical">Clínica</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                >
                  Simular
                </button>
              </form>
              {simulationResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900">Resultado da Simulação</h4>
                  <p className="text-sm text-gray-600">Orçamento: {simulationResult.budget} milhões</p>
                  <p className="text-sm text-gray-600">Pesquisadores: {simulationResult.researchers}</p>
                  <p className="text-sm text-gray-600">Duração: {simulationResult.duration} meses</p>
                  <p className="text-sm text-gray-600">Tipo: {simulationResult.type}</p>
                  <p className="text-sm text-gray-600">Detalhes: {simulationResult.details}</p>
                  <p className="text-sm text-gray-600 font-bold">Eficácia Estimada: {simulationResult.effectiveness}%</p>
                </div>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Simulação em Computadores */}
            <section id="computer-simulation" className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Simulação em Computadores</h3>
              <button
                onClick={() => handleMedicineSimulation('computer', 90)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
              >
                Simular
              </button>
              {simulationStages.computer && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Resultado: <strong>{simulationStages.computer.result}</strong>
                  </p>
                  <p>Motivo: {simulationStages.computer.reason}</p>
                </div>
              )}
            </section>

            {/* Simulação em Animais */}
            <section id="animal-simulation" className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Simulação em Animais</h3>
              <button
                onClick={() => handleMedicineSimulation('animal', 70)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
              >
                Simular
              </button>
              {simulationStages.animal && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Resultado: <strong>{simulationStages.animal.result}</strong>
                  </p>
                  <p>Motivo: {simulationStages.animal.reason}</p>
                </div>
              )}
            </section>

            {/* Simulação em Seres Humanos */}
            <section id="human-simulation" className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Simulação em Seres Humanos</h3>
              <button
                onClick={() => handleMedicineSimulation('human', 50)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
              >
                Simular
              </button>
              {simulationStages.human && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Resultado: <strong>{simulationStages.human.result}</strong>
                  </p>
                  <p>Motivo: {simulationStages.human.reason}</p>
                </div>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Ferramenta de Análise de Interações */}
            <section id="interaction-analysis" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Análise de Interações Medicamentosas</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  analyzeInteractions(formData.get("medicine1"), formData.get("medicine2"));
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medicamento 1</label>
                    <input
                      type="text"
                      name="medicine1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      list="medicine-suggestions"
                    />
                    <datalist id="medicine-suggestions">
                      {medicineSuggestions.map((medicine, index) => (
                        <option key={index} value={medicine} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medicamento 2</label>
                    <input
                      type="text"
                      name="medicine2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      list="medicine-suggestions"
                    />
                    <datalist id="medicine-suggestions">
                      {medicineSuggestions.map((medicine, index) => (
                        <option key={index} value={medicine} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                >
                  Analisar
                </button>
              </form>
              {interactionCalled && interactionAnalysis.length > 0 ? (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900">Resultado da Análise</h4>
                  {interactionAnalysis.map((interaction, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      <strong>Interação:</strong> {interaction.pair.join(' e ')} - {interaction.effect}
                      <br />
                      <strong>Gravidade:</strong> {interaction.severity || 'N/A'}
                      <br />
                      <strong>Recomendação:</strong> {interaction.recommendation || 'N/A'}
                    </p>
                  ))}
                </div>
              ) : interactionCalled && (
                <p className="mt-4 text-sm text-gray-600">Nenhuma interação encontrada.</p>
              )}

              {/* Histórico de consultas */}
              {interactionHistory.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900">Histórico de Consultas</h4>
                  <ul className="mt-4 space-y-2">
                    {interactionHistory.map((entry, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        <strong>Medicamentos:</strong> {entry.medicine1} e {entry.medicine2}
                        <br />
                        <strong>Resultado:</strong> {entry.result[0]?.effect || 'Nenhuma interação encontrada'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Lista de Medicamentos */}
            <section id="medicine-list" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Lista de Medicamentos</h2>
              <div className="grid grid-cols-1 gap-4">
                {medicines.map((medicine, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">{medicine.name}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Doença:</strong> {medicine.disease}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Descrição:</strong> {medicine.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Fabricante:</strong> {medicine.manufacturer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Lista de Pesquisas */}
            <section id="research-list" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisas Relacionadas</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    title: 'Estudo sobre a eficácia do Paracetamol em crianças',
                    description: 'Pesquisa realizada para avaliar a segurança e eficácia do Paracetamol em crianças com febre.',
                    year: 2022,
                    institution: 'Universidade de Medicina de São Paulo',
                  },
                  {
                    title: 'Impacto do Ibuprofeno em pacientes com artrite',
                    description: 'Estudo clínico para analisar os efeitos do Ibuprofeno em pacientes com artrite reumatoide.',
                    year: 2021,
                    institution: 'Instituto Nacional de Saúde',
                  },
                  {
                    title: 'Desenvolvimento de novas formulações de Amoxicilina',
                    description: 'Pesquisa focada em melhorar a biodisponibilidade da Amoxicilina.',
                    year: 2023,
                    institution: 'Centro de Pesquisa BioTech',
                  },
                ].map((research, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">{research.title}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Descrição:</strong> {research.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Ano:</strong> {research.year}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Instituição:</strong> {research.institution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Medicines;
