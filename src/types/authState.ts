export interface AuthState {
  token: string | null;
  user: {
    name: string;
    email: string;
    venueManager: boolean;
  } | null;
  setAuth: (token: string, user: AuthState["user"]) => void;
  clearAuth: () => void;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
}
