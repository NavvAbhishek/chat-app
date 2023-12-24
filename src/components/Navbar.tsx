"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { RiMenu3Fill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const { data: session }: any = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black px-10 py-3 text-white flex justify-between items-center">
      <Link href="/">
        <span className="text-xl cursor-pointer">Chat Hub</span>
      </Link>

      <button className="sm:hidden z-20" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <AiOutlineClose className="w-8 h-8"/> : <RiMenu3Fill className="w-8 h-8"/>}
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black  flex flex-col items-center justify-center z-10 sm:hidden">
          <ul className="space-y-8 text-3xl">
            <li onClick={() => setIsMenuOpen(false)}>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            {!session ? (
              <>
                <li onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </li>
                <li onClick={() => setIsMenuOpen(false)}>
                  <Link href="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>{session.user?.email}</li>
                <li>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-2 py-2 bg-yellow-500 rounded-xl"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      <div className={`sm:flex hidden gap-10 items-center text-xl ${isMenuOpen ? 'hidden' : ''}`}>
        <Link href="/dashboard">
          <span className="cursor-pointer">Dashboard</span>
        </Link>
        {!session ? (
          <>
            <Link href="/login">
              <span className="cursor-pointer">Login</span>
            </Link>
            <Link href="/register">
              <span className="cursor-pointer">Register</span>
            </Link>
          </>
        ) : (
          <>
            <span>{session.user?.email}</span>
            <button
              onClick={() => {
                signOut();
              }}
              className="px-2 py-2 bg-yellow-500 rounded-xl"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
