import { Schema, model, models } from "mongoose";

// Define the schema for the molecule generation history
const MoleculeGenerationHistorySchema = new Schema(
  {
    smiles: {
      type: String,
      required: true,
    },
    numMolecules: {
      type: Number,
      required: true,
    },
    minSimilarity: {
      type: Number,
      required: true,
    },
    particles: {
      type: Number,
      required: true,
    },
    iterations: {
      type: Number,
      required: true,
    },
    generatedMolecules: [
      {
        structure: { type: String, required: true }, // Structure of the generated molecule
        score: { type: Number, required: true },     // Score or rating of the generated molecule
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true } // Automatically handle `createdAt` and `updatedAt`
);

// Check if the model already exists, otherwise create it
const MoleculeGenerationHistory =
  models.MoleculeGenerationHistory || model("MoleculeGenerationHistory", MoleculeGenerationHistorySchema);

export default MoleculeGenerationHistory;
