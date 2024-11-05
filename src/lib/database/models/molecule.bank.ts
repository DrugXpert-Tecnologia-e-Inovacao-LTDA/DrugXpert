import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Molecule document
export interface IMolecule extends Document {
  moleculeName: string;
  smilesStructure: string;
  molecularWeight: number;
  categoryUsage: string;
}

// Define the schema for the Molecule
const MoleculeSchema: Schema = new Schema({
  moleculeName: {
    type: String,
    required: true,
    unique: true, // Ensure molecule names are unique
  },
  smilesStructure: {
    type: String,
    required: true,
  },
  molecularWeight: {
    type: Number,
    required: true,
  },
  categoryUsage: {
    type: String,
    required: true,
  },
});

// Create the Mongoose model
const MoleculeModel = mongoose.model<IMolecule>('Molecule', MoleculeSchema);

// Predefined molecule bank data
const moleculeBank = [
  { moleculeName: "Aspirin", smilesStructure: "CC(=O)OC1=CC=CC=C1C(O)=O", molecularWeight: 180.16, categoryUsage: "Pain reliever/NSAID" },
  { moleculeName: "Caffeine", smilesStructure: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C", molecularWeight: 194.19, categoryUsage: "Stimulant" },
  { moleculeName: "Benzene", smilesStructure: "C1=CC=CC=C1", molecularWeight: 78.11, categoryUsage: "Industrial solvent" },
  { moleculeName: "Glucose", smilesStructure: "C(C1C(C(C(C(O1)O)O)O)O)O", molecularWeight: 180.16, categoryUsage: "Energy source/sugar" },
  { moleculeName: "Penicillin", smilesStructure: "CC1(C2C(C(C(O2)N1C(=O)COC(=O)C)C)S)C=O", molecularWeight: 334.39, categoryUsage: "Antibiotic" },
  { moleculeName: "Ibuprofen", smilesStructure: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", molecularWeight: 206.28, categoryUsage: "Pain reliever/NSAID" },
  { moleculeName: "Acetaminophen", smilesStructure: "CC(=O)NC1=CC=C(O)C=C1", molecularWeight: 151.16, categoryUsage: "Pain reliever/Antipyretic" },
  { moleculeName: "Morphine", smilesStructure: "CN1CCC23C4C1CC(C2C3O)OC5=CC=CC=C45", molecularWeight: 285.34, categoryUsage: "Pain reliever/Opiate" },
  { moleculeName: "Nicotine", smilesStructure: "CN1CCCC1C2=CN=CC=C2", molecularWeight: 162.23, categoryUsage: "Stimulant" },
  { moleculeName: "Ethanol", smilesStructure: "CCO", molecularWeight: 46.07, categoryUsage: "Alcohol/Disinfectant" },
  { moleculeName: "Cholesterol", smilesStructure: "CC(C)C(C)C(C)C(C)C(C)C(C)C(C)C(C)(C)C(C)C(C)C(C)C", molecularWeight: 386.65, categoryUsage: "Biomolecule" },
  { moleculeName: "Vitamin C", smilesStructure: "C(C1C(C(C(C(O1)O)O)O)O)O", molecularWeight: 176.12, categoryUsage: "Nutrient/Antioxidant" },
  { moleculeName: "Ketamine", smilesStructure: "CC(C1=CC2=C(C=C1)C(=O)N(C2=O)C(C)C(=O)C)", molecularWeight: 237.73, categoryUsage: "Anesthetic" },
  { moleculeName: "Lactose", smilesStructure: "C1C(C(C(C(C1O)O)O)O)O", molecularWeight: 342.30, categoryUsage: "Sugar/Disaccharide" },
  { moleculeName: "Serotonin", smilesStructure: "CC(C1=CC=CC=C1C2=CN=C(N2)C(C)C(C(=O)O)C)", molecularWeight: 176.24, categoryUsage: "Neurotransmitter" },
  { moleculeName: "Dopamine", smilesStructure: "CC(C1=CC=CC=C1C(C2=CC=CC=C2)N)O", molecularWeight: 153.18, categoryUsage: "Neurotransmitter" },
  { moleculeName: "Sertraline", smilesStructure: "CC(C1=CC=CC=C1C2=CN=C(N2)C(C)C(C(=O)C)C)", molecularWeight: 306.37, categoryUsage: "Antidepressant" },
  { moleculeName: "Atorvastatin", smilesStructure: "CC(C1=CC=CC=C1C2=CN=C(C=C2)C(C(=O)O)C(=O)C)", molecularWeight: 558.64, categoryUsage: "Cholesterol-lowering agent" },
  { moleculeName: "Metformin", smilesStructure: "CN(C)C(=N)C(=O)N(C)C(=O)C", molecularWeight: 129.16, categoryUsage: "Antidiabetic" },
  { moleculeName: "Folic Acid", smilesStructure: "C(C1=CC2=C(C=C1)C(=O)N(C2=O)C(C)C(=O)C)", molecularWeight: 441.40, categoryUsage: "Vitamin" },
  { moleculeName: "Warfarin", smilesStructure: "CC(C1=CC=C(C=C1)C(=O)O)C(=O)C", molecularWeight: 308.31, categoryUsage: "Anticoagulant" },
  { moleculeName: "Simvastatin", smilesStructure: "CC(C1=CC=C(C=C1)C(=O)O)C(C)C(=O)C", molecularWeight: 418.57, categoryUsage: "Cholesterol-lowering agent" },
  { moleculeName: "Clopidogrel", smilesStructure: "CC(C1=CC=C(C=C1)C(=O)O)C(=O)N(C)C", molecularWeight: 321.85, categoryUsage: "Antiplatelet agent" },
  { moleculeName: "Levothyroxine", smilesStructure: "C1=CC2=C(C=C1)C(=O)N(C2=O)C(C)C(=O)C", molecularWeight: 654.87, categoryUsage: "Thyroid hormone replacement" },
  { moleculeName: "Amoxicillin", smilesStructure: "CC(C1=CC=CC=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 365.42, categoryUsage: "Antibiotic" },
  { moleculeName: "Ranitidine", smilesStructure: "C1=CC=C(C=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 314.38, categoryUsage: "Antihistamine" },
  { moleculeName: "Propranolol", smilesStructure: "C1=CC=C(C=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 259.34, categoryUsage: "Beta-blocker" },
  { moleculeName: "Lisinopril", smilesStructure: "C1=CC=C(C=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 405.50, categoryUsage: "Antihypertensive" },
  { moleculeName: "Alprazolam", smilesStructure: "C1=CC=C(C=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 308.27, categoryUsage: "Anxiolytic" },
  { moleculeName: "Diazepam", smilesStructure: "C1=CC=C(C=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 284.25, categoryUsage: "Anxiolytic" },
  { moleculeName: "Citalopram", smilesStructure: "C1=CC=C(C=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 324.40, categoryUsage: "Antidepressant" },
  { moleculeName: "Tamsulosin", smilesStructure: "C1=CC=C(C=C1)C(=O)N(C)C(C)C(=O)C", molecularWeight: 408.53, categoryUsage: "BPH treatment" },
];

// Function to initialize the molecule bank
export const initializeMoleculeBank = async () => {
  // Check if the database is connected
  if (mongoose.connection.readyState === 0) {
    throw new Error("Database not connected.");
  }

  // Insert predefined molecules if they don't exist
  for (const molecule of moleculeBank) {
    const existingMolecule = await MoleculeModel.findOne({ moleculeName: molecule.moleculeName });
    if (!existingMolecule) {
      await new MoleculeModel(molecule).save();
    }
  }
};

export default MoleculeModel;
