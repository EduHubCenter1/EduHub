// hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback,useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/actions/user.actions";
import type { User as PrismaUser } from "@prisma/client";

// 📝 Types pour une meilleure expérience développeur
interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
  message?: string;
}

interface AuthMetadata {
  role?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  [key: string]: any;
}

type UserProfile = PrismaUser;

/**
 * 🎯 Hook principal d'authentification
 *
 * Ce hook centralise toute la logique d'authentification de votre application.
 * Il agit comme un pont intelligent entre Supabase (qui gère le stockage sécurisé)
 * et React (qui gère l'état réactif de l'interface).
 *
 * Pensez à ce hook comme à un "manager d'authentification" qui :
 * - Surveille constamment l'état de connexion
 * - Synchronise les données entre le serveur et l'interface
 * - Fournit des actions simples pour toutes les opérations auth
 * - Optimise les performances en évitant les appels répétés
 */
export function useAuth() {
  // 🏠 État local : la "mémoire" du hook
  // Ces variables stockent l'état actuel dans la mémoire JavaScript
  // Elles sont réactives : quand elles changent, React re-render automatiquement
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileFetched = useRef(false);

  // 🔧 Instances stables : les "outils" du hook
  // Ces instances sont créées une seule fois et réutilisées
  // Ceci évite de recréer des connexions à chaque render (optimisation importante)
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (e: any) {
      console.error("❌ Erreur lors de la récupération du profil:", e.message);
      setError(e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🚀 Effet d'initialisation : le "moteur de démarrage"
   *
   * Cette fonction se déclenche au montage du hook et configure :
   * 1. La récupération de la session existante (si l'utilisateur était déjà connecté)
   * 2. L'écoute des changements d'authentification en temps réel
   * 3. Le nettoyage des ressources quand le hook se démonte
   */
  useEffect(() => {
    /**
     * 👂 Écoute des événements d'authentification
     *
     * Cette partie est cruciale : elle permet au hook de rester synchronisé
     * avec tous les changements d'authentification, qu'ils viennent de :
     * - L'utilisateur actuel (login/logout)
     * - Un autre onglet du même navigateur
     * - Une expiration automatique de token
     * - Un refresh automatique de token
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
          setLoading(true);
          if (session?.user && !profileFetched.current) {
            await fetchProfile();
            profileFetched.current = true;
          } else {
            setLoading(false);
          }
          break;

        case "USER_UPDATED":
          setLoading(true);
          // Always fetch on USER_UPDATED as data has changed
          if (session?.user) {
            await fetchProfile();
          } else {
            setUser(null);
            setLoading(false);
          }
          break;

        case "TOKEN_REFRESHED":
          // No need to do anything here, session is updated automatically.
          break;

        case "SIGNED_OUT":
          setUser(null);
          setError(null);
          profileFetched.current = false; // Reset the flag
          router.push("/");
          setLoading(false);
          break;

        case "PASSWORD_RECOVERY":
          setLoading(false);
          break;

        default:
          setLoading(false);
      }
    });

    /**
     * 🧹 Fonction de nettoyage
     *
     * Cette fonction se déclenche quand :
     * - Le composant utilisant useAuth se démonte
     * - L'application se ferme
     * - Le hook se reconfigure (rare)
     *
     * Elle évite les fuites mémoire en supprimant les écouteurs d'événements
     */
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, fetchProfile]); // Dépendances stables qui ne changent jamais

  /**
   * 🔑 Action de connexion
   *
   * Cette fonction encapsule toute la complexité de la connexion :
   * - Validation des paramètres
   * - Appel à l'API Supabase
   * - Gestion des erreurs
   * - Retour d'un objet standardisé
   *
   * useCallback garantit que cette fonction n'est recréée que si ses dépendances changent
   * Comme 'supabase' ne change jamais, cette fonction est créée une seule fois
   */
  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      if (!email || !password) {
        return { success: false, error: "Email et mot de passe requis" };
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
          const userFriendlyError =
            result.error === "Invalid login credentials"
              ? "Email ou mot de passe incorrect"
              : result.error || "Une erreur s'est produite";
          return { success: false, error: userFriendlyError };
        }

        return { success: true, data: result.data };
      } catch (networkError: any) {
        console.error("💥 Erreur réseau lors de la connexion:", networkError);
        return {
          success: false,
          error: "Problème de connexion. Vérifiez votre connexion internet.",
        };
      }
    },
    []
  );

  /**
   * 👋 Action de déconnexion
   *
   * Cette fonction gère proprement la déconnexion en appelant l'API.
   */
  const logout = useCallback(async (): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (!response.ok) {
        const result = await response.json();
        console.error("❌ Erreur lors de la déconnexion:", result.error);
        return { success: false, error: result.error };
      }

      setUser(null); // Mise à jour manuelle de l'état
      router.push("/"); // Redirection explicite
      return { success: true };
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de la déconnexion:", error);
      return {
        success: false,
        error: "Erreur lors de la déconnexion",
      };
    }
  }, [router]);

  /**
   * 📝 Action d'inscription
   *
   * Cette fonction gère l'inscription de nouveaux utilisateurs
   * avec possibilité d'ajouter des métadonnées personnalisées
   */
  const register = useCallback(
    async (
      email: string,
      password: string,
      metadata?: AuthMetadata
    ): Promise<AuthResponse> => {
      // Validation côté client
      if (!email || !password) {
        return { success: false, error: "Email et mot de passe requis" };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: "Le mot de passe doit contenir au moins 6 caractères",
        };
      }

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, metadata }),
        });

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error:
              result.error || "Une erreur s'est produite lors de l'inscription",
          };
        }

        return { success: true, data: result.data, message: result.message };
      } catch (networkError: any) {
        console.error("💥 Erreur réseau lors de l'inscription:", networkError);
        return {
          success: false,
          error: "Problème de connexion. Vérifiez votre connexion internet.",
        };
      }
    },
    []
  );

  /**
   * 🔄 Action de réinitialisation de mot de passe
   */
  const resetPassword = useCallback(
    async (email: string): Promise<AuthResponse> => {
      if (!email) {
        return { success: false, error: "Email requis" };
      }

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        if (error) {
          console.error("❌ Erreur de réinitialisation:", error.message);
          return { success: false, error: error.message };
        }

        return {
          success: true,
          message: "Email de réinitialisation envoyé ! Vérifiez votre boîte mail.",
        };
      } catch (error: any) {
        console.error(
          "💥 Erreur inattendue lors de la réinitialisation:",
          error
        );
        return { success: false, error: "Erreur lors de l'envoi de l'email" };
      }
    },
    [supabase]
  );

  /**
   * 👤 Action de mise à jour du profil utilisateur
   */
  const updateProfile = useCallback(
    async (updates: {
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
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Erreur lors de la connexion avec Google" };
    }
  }, [supabase]);

  /**
   * 🔍 Propriétés calculées (computed properties)
   *
   * Ces propriétés sont dérivées de l'état principal
   * Elles offrent une API plus riche et expressive
   */
  const isAuthenticated = !!user;
  const isLoading = loading;
  const userEmail = user?.email || null;
  const userId = user?.id || null;
  const userMetadata: AuthMetadata = user
    ? {
        role: user.role ?? undefined,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        avatar: user.profilePictureUrl ?? undefined,
      }
    : {};

  /**
   * 📤 API publique du hook
   *
   * C'est ce que les composants recevront quand ils appellent useAuth()
   * Organisé en catégories pour une meilleure compréhension
   */
  return {
    // 📊 État actuel
    user, // Objet utilisateur complet de Supabase
    loading: isLoading, // true pendant les opérations async
    error, // Message d'erreur si applicable

    // 🎯 Propriétés dérivées (pour simplifier l'usage)
    isAuthenticated, // true si l'utilisateur est connecté ET loading terminé
    userEmail, // Email de l'utilisateur ou null
    userId, // ID unique de l'utilisateur ou null
    userMetadata, // Métadonnées personnalisées

    // 🎬 Actions d'authentification
    login, // (email, password) => Promise<AuthResponse>
    logout, // () => Promise<AuthResponse>
    register, // (email, password, metadata?) => Promise<AuthResponse>
    resetPassword, // (email) => Promise<AuthResponse>
    updateProfile, // (updates) => Promise<AuthResponse>
    signInWithGoogle, // () => Promise<AuthResponse>

    // 🔧 Accès avancé (pour des cas d'usage spécifiques)
    supabase, // Instance Supabase pour des opérations custom
  };
}
