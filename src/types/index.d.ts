// Type for the molecule structure, includes SMILES and molecular weight
declare type MoleculeStructure = {
  moleculeName: string;  // Name of the molecule
  smilesStructure: string; // SMILES representation
  molecularWeight: number; // Molecular weight
  categoryUsage: string;   // Usage category
};

// Type for molecule generation history
declare type MoleculeGenerationHistoryType = {
  _id?: string;              // Optional ID from MongoDB
  smiles: string;            // SMILES string
  numMolecules: number;      // Number of molecules generated
  minSimilarity: number;      // Minimum similarity threshold
  particles: number;         // Number of particles for generation
  iterations: number;        // Iteration count for generation
  generatedMolecules: MoleculeStructure[]; // Array of generated molecules
  createdAt?: Date;         // Creation date
};

// Type for creating a user
declare type CreateUserParams = {
  email: string;            // User email
  fullname?: string;       // User full name
  password: string;        // User password
  photo: string;           // URL or path to user photo
  firstName?: string;      // User's first name
  lastName?: string;       // User's last name
  userBio?: string;        // User biography
  isEmailVerified?: boolean; // Email verification status
};

// Type for updating user information
declare type UpdateUserParams = {
  firstName: string;      // User's first name
  lastName: string;       // User's last name
  photo: string;          // URL or path to user photo
  userBio?: string;       // User biography
  email: string;          // User email
};

// Type for compound data, includes chemical properties
declare type CompoundData = {
  MolecularFormula: string; // Molecular formula (e.g., C6H12O6)
  MolecularWeight: string;   // Molecular weight as a string
  InChIKey: string;          // InChI Key for the compound
  CanonicalSMILES: string;   // Canonical SMILES representation
  IsomericSMILES: string;    // Isomeric SMILES representation
  IUPACName: string;         // IUPAC name of the compound
  XLogP: string;             // LogP value
  ExactMass: string;         // Exact mass
  MonoisotopicMass: string;  // Monoisotopic mass
  TPSA: string;              // Topological polar surface area
  Complexity: string;        // Complexity of the compound
  Charge: string;            // Charge of the molecule
  HBondDonorCount: string;   // Count of hydrogen bond donors
  HBondAcceptorCount: string; // Count of hydrogen bond acceptors
  RotatableBondCount: string; // Count of rotatable bonds
  HeavyAtomCount: string;    // Count of heavy atoms
};

// Props for modal components, containing ID, title, content, and close text
declare type ModalProps = {
  id: string;               // ID for the modal
  title: string;            // Title of the modal
  content: React.ReactNode; // Content to be rendered inside the modal
  onCloseText: string;      // Text for the close button
};
