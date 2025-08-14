"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../_components/header";

import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      console.error("Google login error:", err);
      alert(err.message || "Google sign-in failed");
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      router.push("/");
    } catch (err) {
      console.error("GitHub login error:", err);
      alert(err.message || "GitHub sign-in failed");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      console.error("Email login error:", err);
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Welcome Back
          </h2>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <img className="w-5 h-5" src="/google-icon.png" />
              <span className="text-gray-700">Sign in with Google</span>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-neutral-800 text-white rounded-lg shadow-sm hover:bg-neutral-600 transition"
            >
              <img className="w-5 h-5" src="/github-icon.png" />
              <span>Sign in with GitHub</span>
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500 ">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}