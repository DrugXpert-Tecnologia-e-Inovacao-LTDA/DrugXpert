import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-measure/dist/leaflet-measure.js';

// Fix for marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Restructured hierarchical data with Countries > States > Cities
const hierarchicalData = [
  {
    id: "br",
    name: "Brasil",
    level: "country",
    coordinates: [-15.7942, -47.8645],
    diseaseCount: 220,
    medicineCount: 185,
    vaccineTrials: 32,
    type: "research",
    stats: {
      activeClinicalTrials: 95,
      researchInvestment: "4.8B",
      topDiseases: ["Dengue", "COVID-19", "Malária", "Zika", "Febre Amarela"],
      researchTeams: 380,
      patentsPending: 62,
      collaboratingInstitutions: 35,
      yearlyPublications: 1290
    },
    regions: [
      {
        id: "br-sp",
        name: "São Paulo",
        level: "state",
        coordinates: [-23.5505, -46.6333],
        diseaseCount: 80,
        medicineCount: 90,
        vaccineTrials: 15,
        type: "research",
        stats: {
          activeClinicalTrials: 45,
          researchInvestment: "2.1B",
          topDiseases: ["Dengue", "COVID-19", "Hipertensão"],
          researchTeams: 180,
          patentsPending: 28,
          collaboratingInstitutions: 20,
          yearlyPublications: 650
        },
        cities: [
          {
            id: "br-sp-campinas",
            name: "Campinas",
            level: "city",
            coordinates: [-22.9071, -47.0628],
            diseaseCount: 35,
            medicineCount: 40,
            vaccineTrials: 7,
            type: "research",
            stats: {
              activeClinicalTrials: 18,
              researchInvestment: "0.8B",
              topDiseases: ["Dengue", "COVID-19"],
              researchTeams: 75,
              patentsPending: 12,
              collaboratingInstitutions: 8,
              yearlyPublications: 280
            }
          },
          {
            id: "br-sp-ribeirao",
            name: "Ribeirão Preto",
            level: "city",
            coordinates: [-21.1775, -47.8103],
            diseaseCount: 28,
            medicineCount: 32,
            vaccineTrials: 5,
            type: "research",
            stats: {
              activeClinicalTrials: 15,
              researchInvestment: "0.6B",
              topDiseases: ["Dengue", "Leishmaniose"],
              researchTeams: 60,
              patentsPending: 9,
              collaboratingInstitutions: 6,
              yearlyPublications: 220
            }
          }
        ]
      },
      {
        id: "br-rj",
        name: "Rio de Janeiro",
        level: "state",
        coordinates: [-22.9068, -43.1729],
        diseaseCount: 65,
        medicineCount: 70,
        vaccineTrials: 10,
        type: "production",
        stats: {
          activeClinicalTrials: 35,
          researchInvestment: "1.5B",
          topDiseases: ["COVID-19", "Febre Amarela", "Dengue"],
          researchTeams: 120,
          patentsPending: 18,
          collaboratingInstitutions: 15,
          yearlyPublications: 450
        },
        cities: [
          {
            id: "br-rj-rio",
            name: "Rio de Janeiro",
            level: "city",
            coordinates: [-22.9068, -43.1729],
            diseaseCount: 45,
            medicineCount: 55,
            vaccineTrials: 8,
            type: "production",
            stats: {
              activeClinicalTrials: 25,
              researchInvestment: "1.2B",
              topDiseases: ["COVID-19", "Febre Amarela"],
              researchTeams: 85,
              patentsPending: 14,
              collaboratingInstitutions: 10,
              yearlyPublications: 320
            }
          }
        ]
      }
    ]
  },
  {
    id: "us",
    name: "EUA",
    level: "country",
    coordinates: [37.0902, -95.7129],
    diseaseCount: 350,
    medicineCount: 280,
    vaccineTrials: 85,
    type: "production",
    stats: {
      activeClinicalTrials: 1250,
      researchInvestment: "125B",
      topDiseases: ["Câncer", "Alzheimer", "Diabetes", "Doenças Cardíacas", "Obesidade"],
      researchTeams: 2200,
      patentsPending: 445,
      collaboratingInstitutions: 189,
      yearlyPublications: 5500
    },
    regions: [
      {
        id: "us-ca",
        name: "Califórnia",
        level: "state",
        coordinates: [36.7783, -119.4179],
        diseaseCount: 150,
        medicineCount: 120,
        vaccineTrials: 30,
        type: "research",
        stats: {
          activeClinicalTrials: 450,
          researchInvestment: "45B",
          topDiseases: ["Câncer", "HIV", "Alzheimer"],
          researchTeams: 750,
          patentsPending: 165,
          collaboratingInstitutions: 70,
          yearlyPublications: 2100
        },
        cities: [
          {
            id: "us-ca-sf",
            name: "São Francisco",
            level: "city",
            coordinates: [37.7749, -122.4194],
            diseaseCount: 85,
            medicineCount: 70,
            vaccineTrials: 18,
            type: "research",
            stats: {
              activeClinicalTrials: 280,
              researchInvestment: "28B",
              topDiseases: ["HIV", "Câncer", "Doenças Neurodegenerativas"],
              researchTeams: 450,
              patentsPending: 110,
              collaboratingInstitutions: 45,
              yearlyPublications: 1300
            }
          }
        ]
      },
      {
        id: "us-ma",
        name: "Massachusetts",
        level: "state",
        coordinates: [42.4072, -71.3824],
        diseaseCount: 120,
        medicineCount: 100,
        vaccineTrials: 25,
        type: "research",
        stats: {
          activeClinicalTrials: 380,
          researchInvestment: "38B",
          topDiseases: ["Câncer", "Doenças Raras", "Imunologia"],
          researchTeams: 650,
          patentsPending: 145,
          collaboratingInstitutions: 60,
          yearlyPublications: 1900
        },
        cities: [
          {
            id: "us-ma-boston",
            name: "Boston",
            level: "city",
            coordinates: [42.3601, -71.0589],
            diseaseCount: 95,
            medicineCount: 85,
            vaccineTrials: 22,
            type: "research",
            stats: {
              activeClinicalTrials: 350,
              researchInvestment: "35B",
              topDiseases: ["Câncer", "Doenças Autoimunes", "Neurologia"],
              researchTeams: 580,
              patentsPending: 130,
              collaboratingInstitutions: 55,
              yearlyPublications: 1750
            }
          }
        ]
      }
    ]
  },
  // ...existing countries (Japan, South Africa, India)
];

// Função para extrair todos os níveis (país, estado, cidade) em uma estrutura plana
const extractAllLocations = (data) => {
  let allLocations = [];
  
  // Adiciona países
  data.forEach(country => {
    allLocations.push({...country});
    
    // Adiciona estados/regiões
    if (country.regions && country.regions.length > 0) {
      country.regions.forEach(region => {
        allLocations.push({
          ...region,
          parentName: country.name,
          parentId: country.id
        });
        
        // Adiciona cidades
        if (region.cities && region.cities.length > 0) {
          region.cities.forEach(city => {
            allLocations.push({
              ...city,
              parentName: region.name,
              parentId: region.id,
              grandparentName: country.name,
              grandparentId: country.id
            });
          });
        }
      });
    }
  });
  
  return allLocations;
};

// Gerar dados planificados a partir da estrutura hierárquica
const mockData = [...extractAllLocations(hierarchicalData)];

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

// Novos componentes de controle para o mapa
const MapControls = () => {
  const map = useMap();
  
  useEffect(() => {
    // Adicionar controle de tela cheia
    L.control.fullscreen({
      position: 'topleft',
      title: 'Modo tela cheia',
      titleCancel: 'Sair do modo tela cheia',
      forceSeparateButton: true,
    }).addTo(map);
    
    // Adicionar ferramenta de medição
    const measureControl = new L.Control.Measure({
      position: 'topleft',
      primaryLengthUnit: 'kilometers',
      secondaryLengthUnit: 'miles',
      primaryAreaUnit: 'sqkilometers',
      secondaryAreaUnit: 'sqmiles',
      activeColor: '#3D9970',
      completedColor: '#FF4136',
      localization: 'pt_BR',
    });
    measureControl.addTo(map);
    
    return () => {
      // Cleanup on unmount
      map.removeControl(measureControl);
    };
  }, [map]);
  
  return null;
};

// Adicionar função de gradiente de cores para o heatmap
const getHeatmapColor = (value) => {
  // Normaliza o valor para uma escala de 0-1
  const normalized = Math.min(Math.max(value / 200, 0), 1);
  
  // Define os valores RGB para o gradiente (azul-verde-amarelo-vermelho)
  if (normalized < 0.25) {
    // Azul para verde (0-25%)
    const g = Math.floor(normalized * 4 * 255);
    return `rgb(0, ${g}, 255)`;
  } else if (normalized < 0.5) {
    // Verde para amarelo (25-50%)
    const r = Math.floor((normalized - 0.25) * 4 * 255);
    return `rgb(${r}, 255, ${255 - r})`;
  } else if (normalized < 0.75) {
    // Amarelo para laranja (50-75%)
    const g = Math.floor(255 - (normalized - 0.5) * 4 * 127);
    return `rgb(255, ${g}, 0)`;
  } else {
    // Laranja para vermelho (75-100%)
    const g = Math.floor(128 - (normalized - 0.75) * 4 * 128);
    return `rgb(255, ${g}, 0)`;
  }
};

// Atualizar o componente de legenda para mostrar os níveis hierárquicos
const MapLegend = ({ viewMode }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md absolute bottom-5 left-5 z-[1000] max-w-xs">
      <h4 className="font-bold text-sm mb-2">Legenda</h4>
      
      {viewMode === "standard" ? (
        // Legenda padrão
        <div className="space-y-2">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></div>
              <span className="text-xs">{typeLabels[type]}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-gray-600">O tamanho do marcador representa a quantidade de medicamentos</p>
          </div>
          
          {/* Adicionar legendas para os níveis */}
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium mb-1">Níveis Geográficos:</p>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
              <span className="text-xs">País</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full border-2 border-dashed border-white"></div>
              </div>
              <span className="text-xs">Estado/Província</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full">
                  <div className="w-1 h-1 bg-white rounded-full m-auto"></div>
                </div>
              </div>
              <span className="text-xs">Cidade</span>
            </div>
          </div>
        </div>
      ) : (
        // Legenda do heatmap
        <div className="space-y-2">
          <div className="h-4 w-full rounded-sm mb-1" 
               style={{ 
                 background: 'linear-gradient(to right, rgb(0, 0, 255), rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 0, 0))' 
               }}>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Baixo</span>
            <span>Médio</span>
            <span>Alto</span>
          </div>
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-gray-600">Intensidade baseada na quantidade de medicamentos</p>
            <p className="text-xs text-gray-600 mt-1">O tamanho do marcador também representa a quantidade</p>
          </div>
          
          {/* Níveis para o heatmap também */}
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium mb-1">Níveis Geográficos:</p>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <span className="text-xs">País</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full">
                  <div className="w-1.5 h-1.5 bg-white rounded-full m-auto"></div>
                </div>
              </div>
              <span className="text-xs">Estado/Província/Cidade</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de marcador arrastável
function DraggableMarker({ data, viewMode, focusOnParent }) {
  const { id, name, level, coordinates, diseaseCount, medicineCount, vaccineTrials, type, stats, parentName, parentId, grandparentName } = data;
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState({
    lat: coordinates[0],
    lng: coordinates[1]
  });
  const markerRef = useRef(null);
  
  // Função para determinar o tamanho do ícone baseado na contagem de medicamentos e nível
  const getMarkerIcon = () => {
    // Ajustar tamanho baseado no nível (país maior, cidade menor)
    let sizeMultiplier = 1;
    if (level === "country") sizeMultiplier = 1.2;
    else if (level === "state") sizeMultiplier = 0.9;
    else if (level === "city") sizeMultiplier = 0.7;
    
    const size = Math.max(20, Math.min(50, (medicineCount / 200) * 40 + 20)) * sizeMultiplier;
    
    // Definir estilo baseado no nível
    let strokeWidth = 1;
    let strokeDasharray = "";
    if (level === "state") strokeDasharray = "2";
    if (level === "city") strokeDasharray = "1 2";
    
    let iconUrl;
    if (viewMode === "heatmap") {
      // No modo heatmap, usa cores baseadas na intensidade
      const color = getHeatmapColor(medicineCount).replace('rgb', 'rgba').replace(')', ', 0.8)');
      // Criar um ícone dinâmico baseado na cor do heatmap
      const svgTemplate = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-dasharray="${strokeDasharray}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          ${level !== "country" ? `<circle cx="12" cy="9" r="3" fill="white" stroke="none"/>` : ``}
        </svg>
      `;
      const svgUri = 'data:image/svg+xml;base64,' + btoa(svgTemplate);
      iconUrl = svgUri;
    } else {
      // No modo padrão, usa cores baseadas no tipo
      const color = typeColors[type];
      const svgTemplate = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-dasharray="${strokeDasharray}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          ${level !== "country" ? `<circle cx="12" cy="9" r="3" fill="white" stroke="none"/>` : ``}
        </svg>
      `;
      const svgUri = 'data:image/svg+xml;base64,' + btoa(svgTemplate);
      iconUrl = svgUri;
    }
    
    return L.icon({
      iconUrl,
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      popupAnchor: [0, -size]
    });
  };
  
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );
  
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={getMarkerIcon()}
    >
      <Popup className="custom-popup">
        <div className="p-4 max-w-md">
          {/* Breadcrumb navegável para a hierarquia */}
          {level !== "country" && (
            <div className="text-sm text-gray-600 mb-2">
              {level === "city" ? (
                <div className="flex items-center gap-1">
                  <span>{grandparentName}</span>
                  <span>&gt;</span>
                  <button 
                    className="text-blue-600 hover:underline" 
                    onClick={() => focusOnParent(parentId)}
                  >
                    {parentName}
                  </button>
                  <span>&gt;</span>
                  <span className="font-medium">{name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button 
                    className="text-blue-600 hover:underline" 
                    onClick={() => focusOnParent(parentId)}
                  >
                    {parentName}
                  </button>
                  <span>&gt;</span>
                  <span className="font-medium">{name}</span>
                </div>
              )}
            </div>
          )}
          
          <h3 className="font-bold text-xl mb-3 border-b pb-2">{name}</h3>
          <div className="mb-2 flex items-center justify-between">
            <span 
              onClick={toggleDraggable} 
              className="cursor-pointer text-sm text-blue-600 hover:underline"
            >
              {draggable ? 'Clique para fixar marcador' : 'Clique para tornar o marcador arrastável'}
            </span>
            
            <span className="text-xs px-2 py-1 rounded bg-gray-100">
              {level === "country" ? "País" : level === "state" ? "Estado/Província" : "Cidade"}
            </span>
          </div>
          
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
          
          {/* Coordenadas atuais */}
          <div className="mt-2 text-xs text-gray-600">
            Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

const WorldMap = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("standard"); // standard ou heatmap
  const [heatmapIntensity, setHeatmapIntensity] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("all"); // all, country, state, city
  const mapRef = useRef(null);

  // Filtragem por tipo
  const typeFilteredData = selectedType === "all" 
    ? mockData 
    : mockData.filter(item => item.type === selectedType);
    
  // Filtragem por nível
  const levelFilteredData = selectedLevel === "all"
    ? typeFilteredData
    : typeFilteredData.filter(item => item.level === selectedLevel);
    
  // Filtragem por termo de busca
  const searchFilteredData = searchTerm
    ? levelFilteredData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.stats.topDiseases && item.stats.topDiseases.some(disease => 
          disease.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (item.parentName && item.parentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.grandparentName && item.grandparentName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : levelFilteredData;
    
  // Função para exportar dados
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(searchFilteredData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "health_centers_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  // Função para encontrar o centro no mapa
  const focusOnCenter = (coordinates, zoom = 6) => {
    if (mapRef.current) {
      mapRef.current.flyTo(coordinates, zoom);
    }
  };
  
  // Função para focar em um local pelo ID
  const focusOnLocationById = (id) => {
    const location = mockData.find(item => item.id === id);
    if (location) {
      const zoomLevel = location.level === "country" ? 4 : location.level === "state" ? 6 : 8;
      focusOnCenter(location.coordinates, zoomLevel);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Centros Globais de Saúde</h2>
          
          <div className="flex gap-2">
            {/* Barra de pesquisa */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar país, estado ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 pr-8 border rounded-full text-sm w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Botões de modo de visualização */}
            <div className="flex border rounded-full overflow-hidden">
              <button
                onClick={() => setViewMode("standard")}
                className={`px-3 py-1 text-sm ${
                  viewMode === "standard" ? "bg-gray-800 text-white" : "bg-gray-200"
                }`}
              >
                Padrão
              </button>
              <button
                onClick={() => setViewMode("heatmap")}
                className={`px-3 py-1 text-sm ${
                  viewMode === "heatmap" ? "bg-gray-800 text-white" : "bg-gray-200"
                }`}
              >
                Heatmap
              </button>
            </div>
            
            {/* Botão de exportar dados */}
            <button
              onClick={exportData}
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center"
            >
              <span className="mr-1"></span> Exportar
            </button>
          </div>
        </div>
        
        {/* Controle de intensidade do heatmap */}
        {viewMode === "heatmap" && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Intensidade do Heatmap: {heatmapIntensity.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={heatmapIntensity}
              onChange={(e) => setHeatmapIntensity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
        
        {/* Filtros de tipo */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedType === "all" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
          >
            Todos os Tipos
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
        
        {/* Filtros de nível */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedLevel("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedLevel === "all" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
          >
            Todos os Níveis
          </button>
          <button
            onClick={() => setSelectedLevel("country")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedLevel === "country" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
          >
            Países
          </button>
          <button
            onClick={() => setSelectedLevel("state")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedLevel === "state" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
          >
            Estados/Províncias
          </button>
          <button
            onClick={() => setSelectedLevel("city")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedLevel === "city" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
          >
            Cidades
          </button>
        </div>
        
        <div style={{ height: "500px", width: "100%", position: "relative" }}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            className="rounded-lg"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {searchFilteredData.map((data) => (
              <DraggableMarker
                key={data.id}
                data={data}
                viewMode={viewMode}
                focusOnParent={focusOnLocationById}
              />
            ))}
            <MapControls />
            <MapLegend viewMode={viewMode} />
          </MapContainer>
        </div>
      </div>

      {/* Tabela explicativa */}
      <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Detalhes dos Centros</h3>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="border p-2 text-left">Nome</th>
                <th className="border p-2 text-left">Nível</th>
                <th className="border p-2 text-left">Tipo</th>
                <th className="border p-2 text-left">Doenças</th>
                <th className="border p-2 text-left">Medicamentos</th>
                <th className="border p-2 text-left">Ação</th>
              </tr>
            </thead>
            <tbody>
              {searchFilteredData.map((item) => {
                const { id, name, level, type, diseaseCount, medicineCount, coordinates, parentName } = item;
                return (
                  <tr key={id} className="odd:bg-white even:bg-gray-100">
                    <td className="border p-2">
                      {parentName ? (
                        <div>
                          <span className="text-xs text-gray-500">{parentName} &gt; </span>
                          {name}
                        </div>
                      ) : name}
                    </td>
                    <td className="border p-2">
                      {level === "country" ? "País" : level === "state" ? "Estado/Província" : "Cidade"}
                    </td>
                    <td className="border p-2">{typeLabels[type]}</td>
                    <td className="border p-2">{diseaseCount}</td>
                    <td className="border p-2">{medicineCount}</td>
                    <td className="border p-2">
                      <button 
                        onClick={() => focusOnCenter(coordinates, level === "country" ? 4 : level === "state" ? 6 : 8)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                      >
                        Ver no mapa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Painel de estatísticas globais */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2">Estatísticas Globais</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-2 rounded text-center">
              <p className="text-sm text-gray-600">Total de Doenças</p>
              <p className="text-xl font-bold">
                {searchFilteredData.reduce((sum, item) => sum + item.diseaseCount, 0)}
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded text-center">
              <p className="text-sm text-gray-600">Total de Medicamentos</p>
              <p className="text-xl font-bold">
                {searchFilteredData.reduce((sum, item) => sum + item.medicineCount, 0)}
              </p>
            </div>
            <div className="bg-purple-50 p-2 rounded text-center">
              <p className="text-sm text-gray-600">Testes de Vacinas</p>
              <p className="text-xl font-bold">
                {searchFilteredData.reduce((sum, item) => sum + (item.vaccineTrials || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
