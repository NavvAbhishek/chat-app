"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SiGmail } from "react-icons/si";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  // const session = useSession();
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

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) router.replace("/dashboard");
    } else {
      setError("");
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-yellow-500 p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8 text-gray-900sign">
            Login
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
              Login
            </button>
            <p className="text-red-600 text-sm my-2">{error && error}</p>
          </form>
          {/* <button
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            onClick={() => {
              signIn("github");
            }}
          >
            Sign In with Github
          </button> */}
          <div className="flex flex-row gap-2.5 text-sm">
            <div className="text-gray-700">Don't have an account yet?</div>
            <Link
              className="block text-center text-gary-900 hover:underline"
              href="/register"
            >
              Register Here
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
