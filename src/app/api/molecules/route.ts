// src/app/api/molecules/route.ts
import mongoose, { Schema, Document } from 'mongoose';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/mongoose'; // Certifique-se de criar esse arquivo

// Definindo o modelo de Molecule no MongoDB
interface IMolecule extends Document {
  moleculeName: string;
  smilesStructure: string;
  molecularWeight: number;
  categoryUsage: string;
}

const MoleculeSchema = new Schema<IMolecule>({
  moleculeName: { type: String, required: true },
  smilesStructure: { type: String, required: true },
  molecularWeight: { type: Number, required: true },
  categoryUsage: { type: String, required: true },
});

const Molecule = mongoose.models.Molecule || mongoose.model<IMolecule>('Molecule', MoleculeSchema);

// Função para conectar ao MongoDB
export const connectDb = async () => {
  await connectToDatabase();
};

// Função GET para buscar moléculas
export async function GET() {
  await connectDb();
  const molecules = await Molecule.find({});
  return NextResponse.json(molecules, { status: 200 });
}

// Função POST para adicionar uma nova molécula
export async function POST(request: Request) {
  await connectDb();

  const moleculeData = await request.json();
  const newMolecule = new Molecule(moleculeData);

  try {
    const savedMolecule = await newMolecule.save();
    return NextResponse.json(savedMolecule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save molecule' }, { status: 500 });
  }
}
