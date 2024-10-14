"use client";

import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import Image from "next/image";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import DarkModeSwitcher from "@/components/Header/DarkModeSwitcher";
import { Edit, MailIcon, CameraIcon, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, FormEvent } from "react";
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

  function handleImageUploadSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  function handlePersonalInfoSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        <Breadcrumb pageName="Settings" />
        <div className="mb-4 flex items-center justify-between">
          <span>Toggle Theme</span>
          <DarkModeSwitcher />
        </div>

        {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
        {infoUnchangedMessage && <div className="mb-4 text-red-600">{infoUnchangedMessage}</div>}
        {errors && <div className="mb-4 text-red-600">{errors}</div>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-lg border bg-white shadow-md dark:bg-boxdark">
              <div className="border-b px-5 py-3 dark:border-strokedark">
                <h3 className="text-lg font-medium">Personal Information</h3>
              </div>
              <div className="p-5">
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="w-full">
                      <label className="block text-sm font-medium">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      readOnly
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Bio</label>
                    <textarea
                      name="userBio"
                      rows={4}
                      value={userData.userBio}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary py-2 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Update Info"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white shadow-md dark:bg-boxdark">
              <div className="border-b px-5 py-3 dark:border-strokedark">
                <h3 className="text-lg font-medium">Upload Photo</h3>
              </div>
              <div className="p-5">
                <form onSubmit={handleImageUploadSubmit}>
                  <div className="flex justify-center">
                    <Image
                      src={userData.photo}
                      alt="User Photo"
                      className="h-32 w-32 rounded-full object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                  <label className="block mt-4">
                    <input type="file" onChange={handleFileChange} className="hidden" />
                    <span className="cursor-pointer text-primary">Change Photo</span>
                  </label>
                  <button
                    type="submit"
                    className="mt-4 w-full rounded-lg bg-primary py-2 text-white"
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
