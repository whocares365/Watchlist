"use client";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowFooter(false);
      } else {
        setShowFooter(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <footer
      className={`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        fixed bottom-0 w-full py-3 text-center text-sm text-black
        transform duration-300
        ${showFooter ? "translate-y-0" : "translate-y-full"}
      `}
      style={{
        boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.15)"
      }}
    >
      © {new Date().getFullYear()} Watchlist. Created By Sasha Maksymenko.
    </footer>
  );
}