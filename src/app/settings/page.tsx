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
  const [infoUnchangedMessage, setInfoUnchangedMessage] = useState<string | null>(null); // Mensagem de informações inalteradas

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

  const handlePersonalInfoSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setInfoUnchangedMessage(null); // Limpa a mensagem de informações inalteradas

    const updatedUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      userBio: userData.userBio,
      photo: userData.photo,
      email: userData.email,
    };

    // Verifica se as informações são idênticas
    if (
      updatedUser.firstName === userData.firstName &&
      updatedUser.lastName === userData.lastName &&
      updatedUser.userBio === userData.userBio
    ) {
      setIsLoading(false);
      setInfoUnchangedMessage("Nenhuma informação foi alterada."); // Mensagem informando que as informações não foram alteradas
      // Define um temporizador para limpar a mensagem de informações inalteradas após 6 segundos
      setTimeout(() => {
        setInfoUnchangedMessage(null);
      }, 6000);
      return;
    }

    try {
      if (userData.id) {
        const updated = await updateUser(userData.id, updatedUser);
        setUserData(updated);
        setSuccessMessage("As informações foram alteradas com sucesso!");
        resetFormFields(); // Limpa os campos após o salvamento

        // Define um temporizador para limpar a mensagem de sucesso após 6 segundos
        setTimeout(() => {
          setSuccessMessage(null);
        }, 6000);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors("Falha ao atualizar o perfil.");
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const handleImageUploadSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setInfoUnchangedMessage(null); // Limpa a mensagem de informações inalteradas

    let base64Image = userData.photo;
    if (imageFile) {
      base64Image = await convertImageToBase64(imageFile);
    }

    if (userData.id) {
      const updatedUser = {
        ...userData,
        photo: base64Image,
      };

      // Verifica se a imagem é a mesma
      if (base64Image === userData.photo) {
        setIsLoading(false);
        setInfoUnchangedMessage("Por favor, escolha uma imagem diferente para carregar."); // Mensagem informando que a imagem não foi alterada
        // Define um temporizador para limpar a mensagem de informações inalteradas após 6 segundos
        setTimeout(() => {
          setInfoUnchangedMessage(null);
        }, 6000);
        return;
      }

      try {
        const updated = await updateUser(userData.id, updatedUser);
        setUserData(updated);
        setSuccessMessage("A imagem foi carregada com sucesso!");
        resetImageField(); // Limpa o campo de imagem após o upload

        // Define um temporizador para limpar a mensagem de sucesso após 6 segundos
        setTimeout(() => {
          setSuccessMessage(null);
        }, 6000);
      } catch (error) {
        setIsLoading(false);
        setErrors("Falha ao carregar a imagem.");
        console.error("Erro ao carregar imagem:", error);
      }
    }

    setIsLoading(false);
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setUserData((prevData) => ({
        ...prevData,
        photo: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const resetFormFields = () => {
    setUserData({
      ...userData,
      firstName: "",
      lastName: "",
      userBio: "",
    });
  };

  const resetImageField = () => {
    setImageFile(null);
    setUserData((prevData) => ({
      ...prevData,
      photo: "/images/user/user-03.png", // Revertendo para a imagem padrão
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <div className="mb-4 flex flex-row items-center space-x-2">
          <span>Toggle Theme</span>
          <DarkModeSwitcher />
        </div>
        {successMessage && (
          <div className="mb-4 text-green-600">{successMessage}</div>
        )}
        {infoUnchangedMessage && (
          <div className="mb-4 text-red-600">{infoUnchangedMessage}</div> // Mensagem de informações inalteradas
        )}
        {errors && (
          <div className="mb-4 text-red-600">{errors}</div> // Mensagem de erro
        )}
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
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
                      Email
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
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      About
                    </label>
                    <textarea
                      name="userBio"
                      className="min-h-[120px] w-full rounded-lg border border-stroke bg-gray p-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      value={userData.userBio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded-lg border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded-lg bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Image Upload Form */}
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleImageUploadSubmit}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full overflow-hidden">
                      <Image
                        src={userData.photo}
                        width={55}
                        height={55}
                        alt="User"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button
                          type="button"
                          className="text-sm hover:text-primary"
                          onClick={() => setImageFile(null)}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="text-sm hover:text-primary"
                          onClick={() => {
                            document.getElementById("fileInput")?.click();
                          }}
                        >
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-lg border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      id="fileInput"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <CameraIcon size={20} />
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded-lg border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded-lg bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Upload"}
                    </button>
                  </div>
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
