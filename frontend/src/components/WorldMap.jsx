import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const mockData = [
  {
    name: "Brasil",
    coordinates: [-15.7942, -47.8645],
    diseaseCount: 120,
    medicineCount: 85,
    vaccineTrials: 12,
    type: "research",
    stats: {
      activeClinicalTrials: 45,
      researchInvestment: "2.5B",
      topDiseases: ["Dengue", "COVID-19", "Malária"],
      researchTeams: 280,
      patentsPending: 32,
      collaboratingInstitutions: 15,
      yearlyPublications: 890
    }
  },
  {
    name: "EUA",
    coordinates: [37.0902, -95.7129],
    diseaseCount: 200,
    medicineCount: 150,
    vaccineTrials: 45,
    type: "production",
    stats: {
      activeClinicalTrials: 890,
      researchInvestment: "95B",
      topDiseases: ["Câncer", "Alzheimer", "Diabetes"],
      researchTeams: 1200,
      patentsPending: 245,
      collaboratingInstitutions: 89,
      yearlyPublications: 3500
    }
  },
  {
    name: "Japão",
    coordinates: [35.6895, 139.6917],
    diseaseCount: 150,
    medicineCount: 120,
    vaccineTrials: 30,
    type: "distribution",
    stats: {
      activeClinicalTrials: 320,
      researchInvestment: "12B",
      topDiseases: ["COVID-19", "Influenza", "Hepatite"],
      researchTeams: 500,
      patentsPending: 78,
      collaboratingInstitutions: 25,
      yearlyPublications: 1200
    }
  },
  {
    name: "África do Sul",
    coordinates: [-30.5595, 22.9375],
    diseaseCount: 80,
    medicineCount: 40,
    vaccineTrials: 8,
    type: "research",
    stats: {
      activeClinicalTrials: 25,
      researchInvestment: "1.2B",
      topDiseases: ["HIV", "Tuberculose", "Malária"],
      researchTeams: 150,
      patentsPending: 12,
      collaboratingInstitutions: 10,
      yearlyPublications: 450
    }
  },
  {
    name: "Índia",
    coordinates: [28.6139, 77.2090],
    diseaseCount: 180,
    medicineCount: 130,
    vaccineTrials: 25,
    type: "production",
    stats: {
      activeClinicalTrials: 500,
      researchInvestment: "25B",
      topDiseases: ["COVID-19", "Diabetes", "Hepatite"],
      researchTeams: 800,
      patentsPending: 120,
      collaboratingInstitutions: 50,
      yearlyPublications: 2000
    }
  }
];

const typeColors = {
  research: "#4CAF50",    // Verde
  production: "#2196F3",  // Azul
  distribution: "#9C27B0" // Roxo
};

const typeLabels = {
  research: "Centro de Pesquisa",
  production: "Centro de Produção",
  distribution: "Centro de Distribuição"
};

const statsIcons = {
  activeClinicalTrials: "🔬",
  researchInvestment: "💰",
  topDiseases: "🏥",
  researchTeams: "👥",
  patentsPending: "📜",
  collaboratingInstitutions: "🏛️",
  yearlyPublications: "📚"
};

const statsLabels = {
  activeClinicalTrials: "Estudos Clínicos Ativos",
  researchInvestment: "Investimento em Pesquisa (USD)",
  topDiseases: "Principais Doenças",
  researchTeams: "Equipes de Pesquisa",
  patentsPending: "Patentes Pendentes",
  collaboratingInstitutions: "Instituições Parceiras",
  yearlyPublications: "Publicações Anuais"
};

const WorldMap = () => {
  const [selectedType, setSelectedType] = useState("all");

  const getMarkerSize = (value) => {
    return (value / 200) * 20 + 5;
  };

  const filteredData = selectedType === "all" 
    ? mockData 
    : mockData.filter(item => item.type === selectedType);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Centros Globais de Saúde</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedType === "all" ? "bg-gray-800 text-white" : "bg-gray-200"
              }`}
            >
              Todos
            </button>
            {Object.entries(typeLabels).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedType === type ? "bg-gray-800 text-white" : "bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ height: "500px", width: "100%" }}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {filteredData.map(({ name, coordinates, diseaseCount, medicineCount, vaccineTrials, type, stats }) => (
              <CircleMarker
                key={name}
                center={coordinates}
                radius={getMarkerSize(medicineCount)}
                fillColor={typeColors[type]}
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.7}
              >
                <Popup className="custom-popup">
                  <div className="p-4 max-w-md">
                    <h3 className="font-bold text-xl mb-3 border-b pb-2">{name}</h3>
                    
                    {/* Métricas Principais */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="stat-card bg-blue-50 p-2 rounded">
                        <p className="text-sm text-gray-600">Doenças Monitoradas</p>
                        <p className="text-xl font-bold">{diseaseCount}</p>
                      </div>
                      <div className="stat-card bg-green-50 p-2 rounded">
                        <p className="text-sm text-gray-600">Medicamentos</p>
                        <p className="text-xl font-bold">{medicineCount}</p>
                      </div>
                    </div>

                    {/* Estatísticas Detalhadas */}
                    <div className="space-y-3">
                      {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="flex items-start space-x-2">
                          <span className="text-xl">{statsIcons[key]}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{statsLabels[key]}</p>
                            <p className="font-semibold">
                              {Array.isArray(value) ? value.join(", ") : value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tipo do Centro */}
                    <div className="mt-4 pt-2 border-t">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: `${typeColors[type]}20`, color: typeColors[type] }}>
                        {typeLabels[type]}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Tabela explicativa */}
      <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Detalhes dos Centros</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Centro</th>
              <th className="border p-2 text-left">Tipo</th>
              <th className="border p-2 text-left">Doenças</th>
              <th className="border p-2 text-left">Medicamentos</th>
              <th className="border p-2 text-left">Vacinas</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(({ name, type, diseaseCount, medicineCount, vaccineTrials }) => (
              <tr key={name} className="odd:bg-white even:bg-gray-100">
                <td className="border p-2">{name}</td>
                <td className="border p-2">{typeLabels[type]}</td>
                <td className="border p-2">{diseaseCount}</td>
                <td className="border p-2">{medicineCount}</td>
                <td className="border p-2">{vaccineTrials}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorldMap;
