"use client";
import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import MoleculeStructure from "../../components/MoleculeStructure/index";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  createMoleculeGenerationHistory,
  getMoleculeGenerationHistoryByUser,
} from "@/lib/actions/molecule-generation.action";
import { getUserByEmail } from "@/lib/actions/user.actions";

const ModalLayout = () => {
  const { data: session } = useSession();
  const [smiles, setSmiles] = useState("CCN(CC)C(=O)[C@@]1(C)Nc2c(ccc3ccccc23)C[C@H]1N(C)C");
  const [numMolecules, setNumMolecules] = useState<number>(10);
  const [minSimilarity, setMinSimilarity] = useState<number>(0.3);
  const [particles, setParticles] = useState<number>(30);
  const [iterations, setIterations] = useState<number>(10);
  const [molecules, setMolecules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const user = await getUserByEmail(session.user.email);
          setUserId(user._id);
          const historyFromServer = await getMoleculeGenerationHistoryByUser(user._id);
          setHistory(historyFromServer);
        } catch (error) {
          console.error("Error fetching user or history:", error);
        }
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const invokeUrl = "https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate";

    const payload = {
      algorithm: "CMA-ES",
      num_molecules: numMolecules,
      property_name: "QED",
      minimize: false,
      min_similarity: minSimilarity,
      particles: particles,
      iterations: iterations,
      smi: smiles,
    };

    try {
      const response = await fetch(invokeUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_PUBLIC_API_KEY}`, // Use the API key from .env
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedMolecules = JSON.parse(data.molecules).map((mol: any) => ({
        structure: mol.sample,
        score: mol.score,
      }));

      setMolecules(generatedMolecules);

      if (userId) {
        await createMoleculeGenerationHistory(
          {
            smiles,
            numMolecules,
            minSimilarity,
            particles,
            iterations,
            generatedMolecules,
          },
          userId,
        );

        const updatedHistory = await getMoleculeGenerationHistoryByUser(userId);
        setHistory(updatedHistory);
      } else {
        console.error("User ID is not available.");
      }

      console.log(generatedMolecules);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Generate Molecules" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
        <div className="flex flex-col gap-9 sm:col-span-2">
          <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-[#121212] dark:bg-[#181818]">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                SMILES to Molecule Generator
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      SMILES String
                    </label>
                    <input
                      type="text"
                      value={smiles}
                      onChange={(e) => setSmiles(e.target.value)}
                      placeholder="Enter SMILES string"
                      className="w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-gray-2 dark:bg-[#181818] dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Number of Molecules
                    </label>
                    <input
                      type="number"
                      value={numMolecules}
                      onChange={(e) => setNumMolecules(Number(e.target.value))}
                      placeholder="Enter number of molecules"
                      className="w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-gray-2 dark:bg-[#181818] dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Minimum Similarity
                  </label>
                  <input
                    type="number"
                    value={minSimilarity}
                    onChange={(e) => setMinSimilarity(Number(e.target.value))}
                    placeholder="Enter minimum similarity"
                    className="w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-gray-2 dark:bg-[#181818] dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Particles
                  </label>
                  <input
                    type="number"
                    value={particles}
                    onChange={(e) => setParticles(Number(e.target.value))}
                    placeholder="Enter number of particles"
                    className="w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-gray-2 dark:bg-[#181818] dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Iterations
                  </label>
                  <input
                    type="number"
                    value={iterations}
                    onChange={(e) => setIterations(Number(e.target.value))}
                    placeholder="Enter number of iterations"
                    className="w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-gray-2 dark:bg-[#181818] dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Molecules"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="rounded-lg border border-stroke bg-white p-3 shadow-default dark:border-[#121212] dark:bg-[#181818]">
            <h3 className="font-medium text-black dark:text-white">
              Molecule Generation History
            </h3>
            <div className="mt-4 max-h-96 overflow-y-auto">
              {history.map((entry: any, index) => (
                <div key={index} className="border-b border-stroke py-3">
                  <p className="text-sm text-black dark:text-white">
                    SMILES: {entry.smiles}
                  </p>
                  <p className="text-sm text-black dark:text-white">
                    Generated Molecules: {entry.generatedMolecules.length}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-[#121212] dark:bg-[#181818]">
            <h3 className="font-medium text-black dark:text-white">
              Generated Molecules
            </h3>
            <div className="p-6.5">
              {molecules.map((molecule, index) => (
                <MoleculeStructure key={index} structure={molecule.structure} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ModalLayout;
