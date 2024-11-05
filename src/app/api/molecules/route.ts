// src/app/api/molecules/route.ts
import { NextResponse } from 'next/server';

// Simulação do banco de dados
const moleculeBank = [
  {
    moleculeName: "Aspirin",
    smilesStructure: "CC(=O)OC1=CC=CC=C1C(O)=O",
    molecularWeight: 180.16,
    categoryUsage: "Pain reliever/NSAID",
  },
  {
    moleculeName: "Caffeine",
    smilesStructure: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    molecularWeight: 194.19,
    categoryUsage: "Stimulant",
  },
  {
    moleculeName: "Benzene",
    smilesStructure: "C1=CC=CC=C1",
    molecularWeight: 78.11,
    categoryUsage: "Industrial solvent",
  },
  {
    moleculeName: "Glucose",
    smilesStructure: "C(C1C(C(C(C(O1)O)O)O)O)O",
    molecularWeight: 180.16,
    categoryUsage: "Energy source/sugar",
  },
  {
    moleculeName: "Penicillin",
    smilesStructure: "CC1(C2C(C(C(O2)N1C(=O)COC(=O)C)C)S)C=O",
    molecularWeight: 334.39,
    categoryUsage: "Antibiotic",
  },
  // Adicione o restante das moléculas conforme necessário
];

// Função GET para /api/molecules
export async function GET() {
  return NextResponse.json(moleculeBank, { status: 200 });
}
