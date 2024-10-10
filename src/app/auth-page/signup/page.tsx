"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import ComponentHeader from "@/components/ComponentHeader/ComponentHeader";
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const validateForm = useCallback(() => {
    if (
      !user.email ||
      !user.firstName ||
      !user.lastName ||
      !user.password ||
      !user.confirmPassword
    ) {
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

      // Reset form
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
      setIsImageVisible(false); // Hide image on successful signup
    } catch (error) {
      console.error("Error registering user:", error);
      setErrors("Registration failed.");
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <ComponentHeader pageName="Sign Up" />

      <div className="flex flex-wrap items-center">
        {isImageVisible && (
          <div className="hidden xl:block xl:w-1/2 h-full"> {/* Image container half width */}
            <Image
              src="/images/signin-image.png" // Sign Up image path
              alt="Sign Up visual"
              className="h-full w-full object-cover" // Full height to match form
              width={600}
              height={600}
            />
          </div>
        )}

        <div className="mx-auto w-full xl:w-1/2 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Start for free</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign Up to ProteinBind
            </h2>

            {errors && <div className="text-red-500 mb-4">{errors}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-4 top-4">
                    <UserIcon />
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-4 top-4">
                    <UserIcon />
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-4 top-4">
                    <MailIcon />
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    placeholder="6+ Characters, 1 Capital letter"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-4 top-4">
                    <LockIcon />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-4 top-4">
                    <LockIcon />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Bio
                </label>
                <textarea
                  name="userBio"
                  value={user.userBio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-5">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-gradient-to-r from-[#5c8d2f] to-[#215153] p-4 text-white transition hover:bg-opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <LoaderCircle className="mr-2 animate-spin" /> Signing
                      Up...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth-page/signin" className="text-primary">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};


export default SignUp;
