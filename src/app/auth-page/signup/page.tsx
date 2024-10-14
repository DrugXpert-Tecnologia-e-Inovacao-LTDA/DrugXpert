"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { createUser } from "@/lib/actions/user.actions";
import { CameraIcon, LoaderCircle, LockIcon, MailIcon, UserIcon } from "lucide-react";

const SignUp: React.FC = () => {
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
    } catch (error) {
      console.error("Error registering user:", error);
      setErrors("Registration failed.");
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center py-4 mb-7">
        <img src="/images/logo/logo.png" alt="DrugXpert logo" className="w-16 h-16 md:w-18 md:h-18" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-4 lg:px-0">
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

        <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-boxdark">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-black dark:text-white">Sign Up to DrugXpert</h2>
            <p className="text-gray-500">Start for free</p>
          </div>

          {errors && <div className="text-red-500 mb-4">{errors}</div>}

          <form onSubmit={handleSubmit}>
            {["firstName", "lastName", "email", "password", "confirmPassword"].map((field, idx) => (
              <div className="mb-4" key={idx}>
                <label className="block font-medium text-black dark:text-white mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="relative">
                  <input
                    type={field.includes("password") ? "password" : "text"}
                    name={field}
                    value={(user as any)[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter your ${field}`}
                    className="w-full border border-stroke py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {field.includes("password") ? <LockIcon /> : <UserIcon />}
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
                className="w-full border py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label className="block font-medium text-black dark:text-white mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
                disabled={isLoading}
              />
              {imageFile && <p className="text-sm mt-2">Selected: {imageFile.name}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5c8d2f] to-[#215153] text-white py-3 rounded-lg hover:bg-opacity-90 transition"
              disabled={isLoading}
            >
              {isLoading ? <LoaderCircle className="animate-spin mx-auto" /> : "Sign Up"}
            </button>

            <p className="mt-6 text-center">
              Already have an account?{" "}
              <Link href="/auth-page/signin" className="text-primary">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignUp;
