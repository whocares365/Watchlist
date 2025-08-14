"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Header from "../_components/header";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const signUp = async (e) => {
    e.preventDefault();
    if(password == repPassword){
      try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }}
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <Header/>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Create an Account
          </h2>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                value={repPassword}
                onChange={(e) => setRepPassword(e.target.value)}
                type="password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
            onClick={signUp}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}