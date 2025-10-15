import { createContext } from "react";

export const AuthContext = createContext<
  | { isAuthenticated: boolean; login: () => void; logout: () => void }
  | undefined
>(undefined);
