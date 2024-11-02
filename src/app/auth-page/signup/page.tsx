"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import do hook useRouter
import Link from "next/link";
import Image from "next/image";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { createUser } from "@/lib/actions/user.actions";
import { signIn } from "next-auth/react"; // Importando signIn do next-auth
import {
  CameraIcon, LoaderCircle, LockIcon, MailIcon, UserIcon,
  Eye, EyeOff, Mail
} from "lucide-react";

// Componente de Popup
const EmailVerificationPopup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-md w-90 relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        onClick={onClose}
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 text-center">Verify your Email</h2>
      <p className="text-center text-gray-600 mb-6">
        Please check your email and click the verification link.
      </p>
      <div className="flex justify-around">
        <button
          className="bg-gradient-to-r from-[#5c8d2f] to-[#215153] text-white px-7 py-2 rounded-md hover:bg-green-600 transition"
          onClick={onClose}
        >
          Ok
        </button>
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition border border-black"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const SignUp: React.FC = () => {
  const router = useRouter(); // Instância do router
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    userBio: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageVisible, setIsImageVisible] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false); // Estado para o popup

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const validateForm = useCallback(() => {
    if (!user.email || !user.firstName || !user.lastName || !user.password || !user.confirmPassword) {
      return "Please fill in all the fields.";
    }
    if (user.password !== user.confirmPassword) {
      return "Passwords do not match.";
    }
    if (!imageFile) {
      return "Please upload a profile picture.";
    }
    return null;
  }, [user, imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    const formError = validateForm();
    if (formError) {
      setErrors(formError);
      setIsLoading(false);
      return;
    }

    try {
      let base64Image = "";
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        base64Image = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      }

      const createdUser = await createUser({ ...user, photo: base64Image });
      console.log(createdUser);

      // Limpar o formulário
      setUser({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        userBio: "",
      });
      setImageFile(null);
      setIsLoading(false);
      setIsImageVisible(false);

      // Exibir o popup de verificação
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Error registering user:", error);
      setErrors("Registration failed.");
      setIsLoading(false);
    }
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    router.push("/auth-page/signin"); // Redirecionar para a página de Sign In quando o popup for fechado
  };

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/" });
    // Não precisa de redirecionamento manual aqui, pois o callbackUrl faz isso automaticamente
  };
  

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center py-4 mb-7">
        <img src="/images/logo/logo.png" alt="DrugXpert logo" className="w-16 h-16 md:w-18 md:h-18" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center px-4 lg:px-0 mb-7">
        {isImageVisible && (
          <div className="hidden lg:block">
            <Image
              src="/images/signin-image.png"
              alt="Sign Up visual"
              className="h-full w-full object-cover"
              width={600}
              height={600}
            />
          </div>
        )}

        <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-boxdark mb-15 lg:mb-0"> {/* Margem ajustada aqui */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-black dark:text-white">Sign Up to DrugXpert</h2>
            <p className="text-gray-500">Start for free</p>
          </div>

          {errors && <div className="text-red-500 mb-4">{errors}</div>}

          <form onSubmit={handleSubmit}>
            {["firstName", "lastName", "email"].map((field, idx) => (
              <div className="mb-4" key={idx}>
                <label className="block font-medium text-black dark:text-white mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name={field}
                    value={(user as any)[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter your ${field}`}
                    className="w-full border border-stroke py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {field === "email" ? <Mail /> : <UserIcon />}
                  </span>
                </div>
              </div>
            ))}

            {["password", "confirmPassword"].map((field, idx) => (
              <div className="mb-4" key={idx}>
                <label className="block font-medium text-black dark:text-white mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="relative">
                  <input
                    type={field === "password" ? (showPassword ? "text" : "password") : showConfirmPassword ? "text" : "password"}
                    name={field}
                    value={(user as any)[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter your ${field}`}
                    className="w-full border border-stroke py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
                    required
                    disabled={isLoading}
                  />
                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => field === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {field === "password" ? (showPassword ? <EyeOff /> : <Eye />) : (showConfirmPassword ? <EyeOff /> : <Eye />)}
                  </span>
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label className="block font-medium text-black dark:text-white mb-1">Bio</label>
              <textarea
                name="userBio"
                value={user.userBio}
                onChange={handleInputChange}
                className="w-full border border-stroke py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-black dark:text-white mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-stroke py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5c8d2f] to-[#215153] text-white py-3 rounded-lg hover:bg-opacity-90 transition mt-4"
              disabled={isLoading}
            >
              {isLoading ? <LoaderCircle className="animate-spin mx-auto" /> : "Sign Up"}
            </button>
          </form>

          <button
            onClick={handleGoogleSignIn}
            className="w-full mt-4 bg-white border border-gray-300 text-black py-3 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <img src="/images/google-icon.svg" alt="Google Icon" className="w-5 h-5" />
            Sign Up with Google
          </button>

          <p className="mt-6 text-center">
            Already have an account?{" "}
            <Link href="/auth-page/signin" className="text-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {isPopupVisible && <EmailVerificationPopup onClose={handlePopupClose} />} {/* Popup de verificação */}
    </DefaultLayout>
  );
};

export default SignUp;
