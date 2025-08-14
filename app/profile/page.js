"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import MainLayout from "@/app/_components/layout";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingUser) {
    return <p className="p-4 text-center text-gray-500">Checking user authentication...</p>;
  }

  const { email, photoURL, displayName } = user;

  return (
    <MainLayout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-center gap-6">
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile photo"
            className="w-24 h-24 rounded-full object-cover shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-gray-700 font-bold">
            {displayName ? displayName[0].toUpperCase() : email[0].toUpperCase()}
          </div>
        )}

        <h1 className="text-2xl font-semibold text-gray-900">{displayName || "User"}</h1>
        <p className="text-gray-700 break-all">{email}</p>

        {/* Optional: Add a logout button here or a link to settings */}
      </div>
    </MainLayout>
  );
}