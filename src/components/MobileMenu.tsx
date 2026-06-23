"use client";

import Link from "next/link";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
        <button onClick={onClose} aria-label="Close menu" className="absolute top-5 right-5 rounded-lg bg-white/5 p-2 text-white hover:bg-white/10">
          <i className="fas fa-xmark text-2xl"></i>
        </button>
        <nav className="flex flex-col gap-6">
          <Link href="/login" onClick={onClose} className="text-2xl font-semibold text-white">
            Login
          </Link>
          <Link href="/register" onClick={onClose} className="text-2xl font-semibold text-white/90">
            Register
          </Link>
        </nav>
      </div>
    </div>
  );
}
