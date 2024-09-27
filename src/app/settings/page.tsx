"use client";

import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DarkModeSwitcher from "@/components/Header/DarkModeSwitcher";
import { Edit, MailIcon, CameraIcon, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { getUserByEmail, updateUser } from "@/lib/actions/user.actions";

const Settings = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userBio: "",
    photo: "",
    id: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [infoUnchangedMessage, setInfoUnchangedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const user = await getUserByEmail(session.user.email);
        setUserData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userBio: user.userBio || "",
          photo: user.photo || "/images/user/user-03.png",
          id: user._id,
        });
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  const handlePersonalInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setInfoUnchangedMessage(null);

    const updatedUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      userBio: userData.userBio,
      email: userData.email,
      photo: userData.photo,
    };

    if (
      updatedUser.firstName === userData.firstName &&
      updatedUser.lastName === userData.lastName &&
      updatedUser.userBio === userData.userBio
    ) {
      setIsLoading(false);
      showMessage(setInfoUnchangedMessage, "Nenhuma informação foi alterada.");
      return;
    }

    try {
      if (userData.id) {
        const updated = await updateUser(userData.id, updatedUser);
        setUserData((prevData) => ({
          ...prevData,
          firstName: updated.firstName,
          lastName: updated.lastName,
          userBio: updated.userBio,
          photo: updated.photo,
        }));
        showMessage(setSuccessMessage, "As informações foram alteradas com sucesso!");
      }
    } catch (error) {
      setErrors("Falha ao atualizar o perfil.");
      console.error("Erro ao atualizar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setInfoUnchangedMessage(null);

    let base64Image = userData.photo;
    if (imageFile) {
      base64Image = await convertImageToBase64(imageFile);
    }

    if (userData.id && base64Image !== userData.photo) {
      try {
        const updatedUser = {
          ...userData,
          photo: base64Image,
        };
        const updated = await updateUser(userData.id, updatedUser);
        setUserData(updated);
        showMessage(setSuccessMessage, "A imagem foi carregada com sucesso!");
      } catch (error) {
        setErrors("Falha ao carregar a imagem.");
        console.error("Erro ao carregar imagem:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      showMessage(setInfoUnchangedMessage, "Por favor, escolha uma imagem diferente para carregar.");
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setImageFile(files[0]);
      setUserData((prevData) => ({
        ...prevData,
        photo: URL.createObjectURL(files[0]),
      }));
    }
  };

  const showMessage = (setMessage: React.Dispatch<React.SetStateAction<string | null>>, message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 6000);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <div className="mb-4 flex flex-row items-center space-x-2">
          <span>Toggle Theme</span>
          <DarkModeSwitcher />
        </div>
        {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
        {infoUnchangedMessage && <div className="mb-4 text-red-600">{infoUnchangedMessage}</div>}
        {errors && <div className="mb-4 text-red-600">{errors}</div>}
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Personal Information</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        First Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3">
                          <User />
                        </span>
                        <input
                          className="w-full rounded-lg border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Last Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3">
                          <User />
                        </span>
                        <input
                          className="w-full rounded-lg border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-3">
                        <MailIcon />
                      </span>
                      <input
                        className="w-full rounded-lg border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        readOnly // Optional, if you want to prevent email editing
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Bio
                    </label>
                    <textarea
                      className="w-full rounded-lg border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      rows={4}
                      name="userBio"
                      value={userData.userBio}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    className="w-full rounded-lg bg-primary py-3 font-medium text-gray hover:bg-opacity-90 dark:bg-primary/80 dark:hover:bg-opacity-80"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Update Info"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Upload Photo</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleImageUploadSubmit}>
                  <div className="mb-5 flex justify-center relative">
                    <Image
                      src={userData.photo}
                      alt="User Photo"
                      className="h-40 w-40 rounded-full object-cover"
                      width={160}
                      height={160}
                    />
                    {/* Full Cover Upload Button Over the Image */}
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 opacity-100 hover:opacity-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden" // Hide the default file input
                      />
                      <div className="flex items-center justify-center h-full w-full bg-primary rounded-full bg-opacity-0 text-white">
                        <CameraIcon size={24} />
                      </div>
                    </label>
                  </div>

                  {/* Espaço em branco para a mensagem de erro */}
                  {infoUnchangedMessage && (
                    <div className="mb-4 text-red-600">{infoUnchangedMessage}</div>
                  )}

                  <button
                    className="w-full rounded-lg bg-primary py-3 font-medium text-gray hover:bg-opacity-90 dark:bg-primary/80 dark:hover:bg-opacity-80"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Upload Photo"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
