"use server"; // This directive tells Next.js that this file contains server-side functions

import { revalidatePath } from "next/cache";
import MoleculeGenerationHistory from "../database/models/molecule-generation.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import mongoose from "mongoose";

// Define or import the MoleculeGenerationHistoryType type. Uncomment and adjust as needed.
// import { MoleculeGenerationHistoryType } from "../types";

export async function createMoleculeGenerationHistory(
  payload: MoleculeGenerationHistoryType, // The payload should conform to the MoleculeGenerationHistoryType structure
  userId: string, // The ID of the user for whom the molecule generation history is being created
) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Create a new history entry and associate it with the user ID
    const newHistoryEntry = await MoleculeGenerationHistory.create({
      ...payload,
      user: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
    });

    // Return the newly created entry, ensuring it's converted to plain JSON
    return JSON.parse(JSON.stringify(newHistoryEntry));
  } catch (error) {
    console.error("Error creating history entry:", error); // Log the error to the console
    handleError(error); // Handle the error (you'll need to implement `handleError`)
  }
}

export async function getMoleculeGenerationHistoryByUser(userId: string) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Find history entries for the given user, sorted by creation date (newest first)
    const historyEntries = await MoleculeGenerationHistory.find({
      user: new mongoose.Types.ObjectId(userId), // Ensure the user ID is treated as an ObjectId
    }).sort({ createdAt: -1 });

    // Return the history entries, ensuring they are converted to plain JSON
    return JSON.parse(JSON.stringify(historyEntries));
  } catch (error) {
    console.error("Error retrieving history entries:", error); // Log the error to the console
    handleError(error); // Handle the error (you'll need to implement `handleError`)
  }
}

export async function getMoleculeGenerationHistoryById(historyId: string) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Find a specific history entry by its ID
    const historyEntry = await MoleculeGenerationHistory.findById(historyId);
    if (!historyEntry) throw new Error("History entry not found"); // Throw an error if the entry is not found

    // Return the history entry, ensuring it's converted to plain JSON
    return JSON.parse(JSON.stringify(historyEntry));
  } catch (error) {
    console.error("Error retrieving history entry by ID:", error); // Log the error to the console
    handleError(error); // Handle the error (you'll need to implement `handleError`)
  }
}

export async function deleteMoleculeGenerationHistory(entryId: string) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Find and delete the history entry by its ID
    const deletedEntry = await MoleculeGenerationHistory.findByIdAndDelete(entryId);

    // Return the deleted entry, ensuring it's converted to plain JSON
    return JSON.parse(JSON.stringify(deletedEntry));
  } catch (error) {
    console.error("Error deleting history entry:", error); // Log the error to the console
    handleError(error); // Handle the error (you'll need to implement `handleError`)
  }
}
