"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CameraIcon } from "lucide-react";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const user = useUser();
  const [uploadSuccess, setUploadSuccess] = useState(false); // Estado para verificar o sucesso do upload
  const [newPhoto, setNewPhoto] = useState(user.photo); // Estado para a nova imagem

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Simular o upload de imagem e alteração da foto de perfil
      const reader = new FileReader();
      reader.onloadend = () => {
        // Aqui atualizamos a imagem de perfil e marcamos o upload como bem-sucedido
        setNewPhoto(reader.result);
        setUploadSuccess(true);

        // Resetar a mensagem de sucesso após alguns segundos
        setTimeout(() => {
          setUploadSuccess(false);
        }, 4000); // 4 segundos
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" containActionButton={false} />

        <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-35 md:h-65">
            {/* Removida a imagem de profile cover */}
            <div className="h-full w-full bg-gray-200 rounded-tl-sm rounded-tr-sm">
              {/* Você pode adicionar um fundo ou qualquer conteúdo aqui se necessário */}
            </div>
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-40 w-40 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:p-3 overflow-hidden">
              <div className="relative drop-shadow-2 rounded-full overflow-hidden">
                <img
                  src={newPhoto} // Usa a nova foto caso o upload tenha sido realizado
                  width={160}
                  height={160}
                  alt="profile"
                  className="rounded-full object-cover w-40 h-40" // Garantindo o tamanho fixo
                />
                <label
                  htmlFor="profile"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <CameraIcon size={24} />
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="sr-only"
                    onChange={handleFileUpload} // Função chamada no upload
                  />
                </label>
              </div>
            </div>

            {/* Mensagem de sucesso */}
            {uploadSuccess && (
              <div className="mt-4 text-green-500">
                Imagem atualizada com sucesso!
              </div>
            )}

            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {user.firstName} {user.lastName}
              </h3>
              <p className="font-medium">Drug Researcher</p>
              <div className="mx-auto mb-5.5 mt-4.5 grid w-max grid-cols-1 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    259
                  </span>
                  <span className="text-sm">Contributions</span>
                </div>
              </div>

              <div className="mx-auto max-w-180">
                <h4 className="font-semibold text-black dark:text-white">
                  About Me
                </h4>
                <p className="mt-4.5">{user.userBio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
