"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

// 🔑 Définition du type du contexte (même API que useAuth)
type AuthContextType = ReturnType<typeof useAuth>;

// 📦 Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🚀 Provider : enveloppe ton app avec l’état auth
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth(); // 👈 Ton hook est utilisé ici une seule fois
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// 🎣 Hook pour consommer facilement le contexte
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return context;
}
