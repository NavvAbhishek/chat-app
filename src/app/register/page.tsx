"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SiGmail } from "react-icons/si";
import { RiLockPasswordFill } from "react-icons/ri";

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 3) {
      setError("Password is invalid");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex flex-col items-center justify-between pt-24">
        <div className="bg-yellow-500 p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8 text-gray-900">
            Register
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-center mb-4">
              <SiGmail
                className="absolute right-5 text-gray-900"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                className="w-full border border-gray-300 text-black rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative flex items-center mb-4">
              <RiLockPasswordFill
                className="absolute right-5 text-gray-900"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="password"
                className="w-full border border-gray-300 text-black rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-2xl hover:bg-gray-900"
            >
              {" "}
              Register
            </button>
            <p className="text-red-600 text-sm my-2">{error && error}</p>
          </form>
          <div className="flex flex-row gap-2.5 text-sm items-center justify-center">
            <div className="text-gray-700">Already a member? </div>
            <Link
              className="block text-center text-gary-900 hover:underline"
              href="/login"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default Register;
