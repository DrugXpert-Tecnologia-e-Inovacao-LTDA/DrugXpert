"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LoaderCircle, LockIcon, MailIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageVisible, setIsImageVisible] = useState<boolean>(true);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setIsImageVisible(false);
        router.push("/");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center py-4">
        <img
          src="/images/logo/logo.png"
          alt="DrugXpert logo"
          className="w-16 h-16 md:w-18 md:h-18"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center px-4 lg:px-0 ">
        {isImageVisible && (
          <div className="hidden lg:block lg:w-1/2">
            <img
              src="/images/login-image.png"
              alt="Sign in visual"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="w-full lg:w-3/5 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md dark:border-strokedark dark:bg-boxdark">
          <div className="mb-6 text-center">
            <span className="block font-medium">Start for free</span>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Sign In to DrugXpert
            </h2>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-black dark:text-white">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-stroke py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
                  required
                  disabled={isLoading}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <MailIcon />
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-black dark:text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ Characters, 1 Capital letter"
                  className="w-full border border-stroke py-3 px-4 rounded-lg dark:border-strokedark dark:bg-form-input dark:text-white"
                  required
                  disabled={isLoading}
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-[#5c8d2f] to-[#215153] py-3 text-white transition hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <LoaderCircle className="animate-spin mr-2" /> Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-4 w-full flex items-center justify-center border py-2 rounded-lg"
            >
              <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
              Sign In with Google
            </button>

            <div className="mt-6 text-center">
              <p>
                Don’t have an account?{" "}
                <Link href="/auth-page/signup" className="text-primary">
                  Sign Up
                </Link>
              </p>
              <p>
                Forgot Password?{" "}
                <Link href="/forget-password" className="text-primary">
                  Reset
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;
