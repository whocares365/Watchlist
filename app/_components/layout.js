"use client";
import Header from "./header";
import Footer from "./footer";
import BackToTopButton from "./backToTopButton";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-295 min-w-160 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <Header />
      <main className="max-w-7xl mx-auto">{children}</main>
      <BackToTopButton/>
      <Footer/>
    </div>
  );
}