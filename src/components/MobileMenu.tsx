"use client";

import Link from "next/link";

export default function MobileMenu({ open, onClose, isLoggedIn, onLogout }: { open: boolean; onClose: () => void; isLoggedIn: boolean; onLogout: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
        <button onClick={onClose} aria-label="Close menu" className="absolute top-5 right-5 rounded-lg text-white">
          <i className="fa fa-xmark text-2xl"></i>
        </button>
        <nav className="flex flex-col gap-6">
          {isLoggedIn ? (
            <>
              <Link href="/profile" onClick={onClose} className="text-2xl font-semibold text-white">
                Profile
              </Link>
              <button onClick={onLogout} className="cursor-pointer text-2xl font-semibold text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose} className="text-2xl font-semibold text-white">
                Login
              </Link>
              <Link href="/register" onClick={onClose} className="text-2xl font-semibold text-white">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
