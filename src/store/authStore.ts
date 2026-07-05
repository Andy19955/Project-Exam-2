import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "@/types/authState";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,

      setHydrated: (v) => set({ hydrated: v }),

      setAuth: (token, user) => {
        set({ token, user });
      },

      clearAuth: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
