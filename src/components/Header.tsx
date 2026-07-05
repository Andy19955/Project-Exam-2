"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-(--border) shadow-md min-h-20">
      <MobileMenu open={open} onClose={() => setOpen(false)} isLoggedIn={Boolean(user)} onLogout={logout} name={String(user?.name)} />
      <div className="flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link href="/" className="text-xl font-bold">
          Holidaze
        </Link>
        <nav className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" className="hover:text-(--text-secondary) hover:underline transition-colors duration-200">
                Profile
              </Link>
              <button onClick={logout} className="cursor-pointer hover:text-(--text-secondary) hover:underline transition-colors duration-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-(--text-secondary) hover:underline transition-colors duration-200">
                Login
              </Link>
              <Link href="/register" className="ml-4 hover:text-(--text-secondary) hover:underline transition-colors duration-200">
                Register
              </Link>
            </>
          )}
        </nav>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="md:hidden p-2">
          <i className="fas fa-bars text-xl hover:text-(--text-secondary) cursor-pointer transition-colors duration-200"></i>
        </button>
      </div>
    </header>
  );
}
