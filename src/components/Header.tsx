"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full px-6 py-4 backdrop-blur-sm sticky top-0 z-10">
      <MobileMenu open={open} onClose={() => setOpen(false)} />
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-white">
          Holidaze
        </Link>
        <nav className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-white hover:text-gray-300 transition-colors duration-200">
            Login
          </Link>
          <Link href="/register" className="ml-4 text-white hover:text-gray-300 transition-colors duration-200">
            Register
          </Link>
        </nav>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="md:hidden p-2">
          <i className="fas fa-bars text-xl text-white hover:text-gray-300 cursor-pointer transition-colors duration-200"></i>
        </button>
      </div>
    </header>
  );
}
