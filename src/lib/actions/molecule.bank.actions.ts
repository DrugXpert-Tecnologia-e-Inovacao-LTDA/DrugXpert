import MoleculeModel, { IMolecule } from '@/lib/database/models/molecule.bank';
import { Types } from 'mongoose';

// Function to create a new molecule
export const createMolecule = async (moleculeData: IMolecule): Promise<IMolecule> => {
  const newMolecule = new MoleculeModel(moleculeData);
  return await newMolecule.save();
};

// Function to get all molecules
export const getAllMolecules = async (): Promise<IMolecule[]> => {
  return await MoleculeModel.find({});
};

// Function to get a molecule by ID
export const getMoleculeById = async (id: string): Promise<IMolecule | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await MoleculeModel.findById(id);
};

// Function to update a molecule by ID
export const updateMoleculeById = async (id: string, updateData: Partial<IMolecule>): Promise<IMolecule | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await MoleculeModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Function to delete a molecule by ID
export const deleteMoleculeById = async (id: string): Promise<IMolecule | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await MoleculeModel.findByIdAndDelete(id);
};

// Function to find a molecule by name
export const getMoleculeByName = async (name: string): Promise<IMolecule | null> => {
  return await MoleculeModel.findOne({ moleculeName: name });
};
