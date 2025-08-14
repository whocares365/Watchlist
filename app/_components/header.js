"use client";

import Image from "next/image"
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const router = useRouter();
  
  const handleLogout = async () => {
    router.push("/");
    await signOut(auth);
  };

  return (
    <header className="mb-10 flex items-center justify-between px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <Link href="/" className="py-1 text-2xl font-bold text-black">
      <div className="flex">
        <span className="text-7xl mt-1">🎬</span> <Image src="/logo.png" width={130} height={100} alt={"watchlist"}></Image>
      </div>
      </Link>

      <div className="flex text-sm">
        {user ? (
  <>
    <div className="flex items-center overflow-hidden shadow-md rounded-md">
      <Link 
        href="/favorites" 
        className="border-1 rounded-l-md  border-pink-600 flex items-center justify-center w-32 h-18 text-white bg-white/10 hover:bg-white/20 hover:shadow-lg active:scale-95 duration-200"
      >
        Favorites
      </Link>
      <Link 
        href="/watchlater" 
        className="border-y-1  border-pink-600 flex items-center justify-center w-32 h-18 text-white bg-white/10 hover:bg-white/20 hover:shadow-lg active:scale-95 duration-200"
      >
        Watch Later
      </Link>
      <Link 
        href="/watched" 
        className="border-1 rounded-r-md border-pink-600 flex items-center justify-center w-32 h-18 text-white bg-white/10 hover:bg-white/20 hover:shadow-lg active:scale-95 duration-200"
      >
        Watched
      </Link>
    </div>
    
    <div className="flex items-center mx-4">
      <Link href="/profile">
        <img src="/profile.png" className="m-auto h-7 w-7 rounded-full border border-white/30" />
        <p className="text-s truncate max-w-[150px] text-white">Profile</p>
      </Link>
    </div>
    <div className="flex items-center justify-center">
      <button
        onClick={handleLogout}
        className="border-1 border-pink-600 rounded-md  text-white h-18 w-15 shadow-md bg-white/10 hover:bg-white/20 hover:shadow-lg active:scale-95 duration-200"
      >
        Log out
      </button>
    </div>
  </>
) : (
  <div className="flex">
    <Link 
      href="/login" 
      className="border-1 rounded-l-md border-pink-600 px-4 h-18 flex items-center text-white shadow-md bg-white/10 hover:bg-white/20"
    >
      Login
    </Link>
    <Link 
      href="/signup" 
      className="border-1 border-l-0 rounded-r-md border-pink-600 px-4 h-18 flex items-center text-white shadow-md bg-white/10 hover:bg-white/20"
    >
      Sign Up
    </Link>
  </div>
)}
      </div>
    </header>
  );
}