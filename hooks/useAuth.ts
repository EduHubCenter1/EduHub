// hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// 📝 Types pour une meilleure expérience développeur
interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
  message?:string;
}

interface AuthMetadata {
  role?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [supabase] = useState(() => createSupabaseBrowserClient());
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Erreur lors de la récupération de session:", error.message);
          setError(error.message);
          setUser(null);
        } else if (session?.user) {
          setUser(session.user);
          setError(null);
        } else {
          setUser(null);
        }
      } catch (unexpectedError: any) {
        console.error("💥 Erreur inattendue durant l'initialisation:", unexpectedError);
        setError("Erreur de connexion");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        switch (event) {
          case 'SIGNED_IN':
            setUser(session?.user || null);
            setError(null);
            break;
            
          case 'SIGNED_OUT':
            setUser(null);
            setError(null);
            router.push('/');
            break;
            
          case 'TOKEN_REFRESHED':
            setUser(session?.user || null);
            break;
            
          case 'USER_UPDATED':
            setUser(session?.user || null);
            break;
            
          case 'PASSWORD_RECOVERY':
            break;
            
          default:
            break;
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        const userFriendlyError = result.error === 'Invalid login credentials' 
          ? "Email ou mot de passe incorrect" 
          : result.error || "Une erreur s'est produite";
        return { success: false, error: userFriendlyError };
      }
      
      const user = result.data?.user;
      if (user) {
        setUser(user);
        return { success: true, data: result.data };
      } else {
        return { success: false, error: "N'a pas pu récupérer les données utilisateur." };
      }

    } catch (networkError: any) {
      console.error("💥 Erreur réseau lors de la connexion:", networkError);
      return { 
        success: false, 
        error: "Problème de connexion. Vérifiez votre connexion internet." 
      };
    }
  }, []);

  const logout = useCallback(async (): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });

      if (!response.ok) {
        const result = await response.json();
        console.error("❌ Erreur lors de la déconnexion:", result.error);
        return { success: false, error: result.error };
      }

      setUser(null);
      router.push('/');
      return { success: true };
      
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de la déconnexion:", error);
      return { 
        success: false, 
        error: "Erreur lors de la déconnexion" 
      };
    }
  }, [router]);

  const register = useCallback(async (registrationData: any): Promise<AuthResponse> => {
    const { email, password } = registrationData;
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }
    
    if (password.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" };
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || "Une erreur s'est produite lors de l'inscription" };
      }
      
      return { success: true, data: result.data, message: result.message };

    } catch (networkError: any) {
      console.error("💥 Erreur réseau lors de l'inscription:", networkError);
      return { 
        success: false, 
        error: "Problème de connexion. Vérifiez votre connexion internet." 
      };
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google sign-in error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Unexpected error during Google sign-in:", error);
      return { success: false, error: error.message };
    }
  }, [supabase]);

  const resetPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    if (!email) {
      return { success: false, error: "Email requis" };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error("❌ Erreur de réinitialisation:", error.message);
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        message: "Email de réinitialisation envoyé ! Vérifiez votre boîte mail."
      };
      
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de la réinitialisation:", error);
      return { success: false, error: "Erreur lors de l'envoi de l'email" };
    }
  }, [supabase]);

  const updateProfile = useCallback(async (updates: {
    email?: string;
    password?: string;
    data?: AuthMetadata;
  }): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      
      if (error) {
        console.error("❌ Erreur de mise à jour:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
      
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de la mise à jour:", error);
      return { success: false, error: "Erreur lors de la mise à jour" };
    }
  }, [supabase]);

  const isAuthenticated = !!user && !loading;
  const isLoading = loading;
  const userEmail = user?.email || null;
  const userId = user?.id || null;
  const userMetadata = user?.user_metadata || {};

  return {
    user,
    loading: isLoading,
    error,
    isAuthenticated,
    userEmail,
    userId,
    userMetadata,
    login,
    logout,
    register,
    signInWithGoogle,
    resetPassword,
    updateProfile,
    supabase,
  };
}
