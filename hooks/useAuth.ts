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
}

interface AuthMetadata {
  role?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  [key: string]: any;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔧 Instances stables : les "outils" du hook
  // Ces instances sont créées une seule fois et réutilisées
  // Ceci évite de recréer des connexions à chaque render (optimisation importante)
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const router = useRouter();

  /**
   * 🚀 Effet d'initialisation : le "moteur de démarrage"
   * 
   * Cette fonction se déclenche au montage du hook et configure :
   * 1. La récupération de la session existante (si l'utilisateur était déjà connecté)
   * 2. L'écoute des changements d'authentification en temps réel
   * 3. Le nettoyage des ressources quand le hook se démonte
   */
  useEffect(() => {
    console.log("🔧 Initialisation du hook useAuth");

    /**
     * 📡 Fonction d'initialisation
     * 
     * Cette fonction vérifie si un utilisateur est déjà connecté
     * Elle interroge Supabase qui va examiner :
     * - Les cookies HTTP-only (sécurisés)
     * - Le localStorage pour le refresh token
     * - La validité des tokens existants
     */
    const initializeAuth = async () => {
      try {
        console.log("📡 Récupération de la session existante...");
        
        // Demande à Supabase : "Y a-t-il une session active ?"
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Erreur lors de la récupération de session:", error.message);
          setError(error.message);
          setUser(null);
        } else if (session?.user) {
          console.log("✅ Session trouvée pour:", session.user.email);
          setUser(session.user);
          setError(null);
        } else {
          console.log("ℹ️ Aucune session active trouvée");
          setUser(null);
        }
      } catch (unexpectedError: any) {
        console.error("💥 Erreur inattendue durant l'initialisation:", unexpectedError);
        setError("Erreur de connexion");
        setUser(null);
      } finally {
        // Que l'initialisation réussisse ou échoue, on arrête le loading
        setLoading(false);
        console.log("🏁 Initialisation terminée");
      }
    };

    // Lancement de l'initialisation
    initializeAuth();

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
    console.log("👂 Configuration de l'écoute des événements auth...");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Événement d'authentification: ${event}`, {
          user: session?.user?.email || "Aucun",
          timestamp: new Date().toISOString()
        });

        // Mise à jour de l'état selon l'événement
        switch (event) {
          case 'INITIAL_SESSION':
            // Session initiale récupérée (rare, car on l'a déjà fait plus haut)
            console.log("🎬 Session initiale chargée");
            break;
            
          case 'SIGNED_IN':
            console.log("✅ Utilisateur connecté avec succès");
            setUser(session?.user || null);
            setError(null);
            break;
            
          case 'SIGNED_OUT':
            console.log("👋 Utilisateur déconnecté");
            setUser(null);
            setError(null);
            // Redirection automatique vers la page d'accueil
            router.push('/');
            break;
            
          case 'TOKEN_REFRESHED':
            console.log("🔄 Token d'accès rafraîchi automatiquement");
            setUser(session?.user || null);
            break;
            
          case 'USER_UPDATED':
            console.log("👤 Informations utilisateur mises à jour");
            setUser(session?.user || null);
            break;
            
          case 'PASSWORD_RECOVERY':
            console.log("🔑 Processus de récupération de mot de passe initié");
            break;
            
          default:
            console.log(`ℹ️ Événement non géré: ${event}`);
        }

        // Dans tous les cas, on arrête le loading si il était encore actif
        setLoading(false);
      }
    );

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
      console.log("🧹 Nettoyage du hook useAuth");
      subscription.unsubscribe();
    };
  }, [supabase, router]); // Dépendances stables qui ne changent jamais

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
  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    console.log("🔑 Tentative de connexion pour:", email);
    
    // Validation basique côté client (sécurité : validation côté serveur aussi !)
    if (!email || !password) {
      const errorMsg = "Email et mot de passe requis";
      console.error("❌", errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      // Appel à l'API d'authentification Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Normalisation de l'email
        password
      });
      
      if (error) {
        console.error("❌ Erreur de connexion:", error.message);
        
        // Messages d'erreur plus conviviaux pour l'utilisateur
        let userFriendlyError = error.message;
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyError = "Email ou mot de passe incorrect";
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyError = "Veuillez confirmer votre email avant de vous connecter";
        }
        
        return { success: false, error: userFriendlyError };
      }

      console.log("✅ Connexion réussie pour:", data.user?.email);
      
      // Note : pas besoin de setUser() ici car onAuthStateChange va s'en charger
      return { success: true, data };
      
    } catch (networkError: any) {
      console.error("💥 Erreur réseau lors de la connexion:", networkError);
      return { 
        success: false, 
        error: "Problème de connexion. Vérifiez votre connexion internet." 
      };
    }
  }, [supabase]);

  /**
   * 👋 Action de déconnexion
   * 
   * Cette fonction gère proprement la déconnexion :
   * - Suppression des tokens côté serveur
   * - Nettoyage du stockage local
   * - Redirection automatique (via onAuthStateChange)
   */
  const logout = useCallback(async (): Promise<AuthResponse> => {
    console.log("👋 Tentative de déconnexion...");
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Erreur lors de la déconnexion:", error.message);
        return { success: false, error: error.message };
      }

      console.log("✅ Déconnexion réussie");
      // Note : la redirection et setUser(null) sont gérés par onAuthStateChange
      
      return { success: true };
      
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de la déconnexion:", error);
      return { 
        success: false, 
        error: "Erreur lors de la déconnexion" 
      };
    }
  }, [supabase]);

  /**
   * 📝 Action d'inscription
   * 
   * Cette fonction gère l'inscription de nouveaux utilisateurs
   * avec possibilité d'ajouter des métadonnées personnalisées
   */
  const register = useCallback(async (
    email: string, 
    password: string, 
    metadata?: AuthMetadata
  ): Promise<AuthResponse> => {
    console.log("📝 Tentative d'inscription pour:", email);
    
    // Validation côté client
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }
    
    if (password.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata || {} // Métadonnées utilisateur personnalisées
        }
      });
      
      if (error) {
        console.error("❌ Erreur d'inscription:", error.message);
        
        let userFriendlyError = error.message;
        if (error.message.includes('User already registered')) {
          userFriendlyError = "Un compte existe déjà avec cet email";
        }
        
        return { success: false, error: userFriendlyError };
      }

      console.log("✅ Inscription réussie. Email de confirmation envoyé à:", email);
      
      return { 
        success: true, 
        data,
        // Message informatif pour l'utilisateur
        message: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte."
      };
      
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de l'inscription:", error);
      return { success: false, error: "Erreur lors de l'inscription" };
    }
  }, [supabase]);

  /**
   * 🔄 Action de réinitialisation de mot de passe
   */
  const resetPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    console.log("🔄 Demande de réinitialisation pour:", email);
    
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

      console.log("✅ Email de réinitialisation envoyé à:", email);
      
      return { 
        success: true,
        message: "Email de réinitialisation envoyé ! Vérifiez votre boîte mail."
      };
      
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de la réinitialisation:", error);
      return { success: false, error: "Erreur lors de l'envoi de l'email" };
    }
  }, [supabase]);

  /**
   * 👤 Action de mise à jour du profil utilisateur
   */
  const updateProfile = useCallback(async (updates: {
    email?: string;
    password?: string;
    data?: AuthMetadata;
  }): Promise<AuthResponse> => {
    console.log("👤 Mise à jour du profil utilisateur");
    
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      
      if (error) {
        console.error("❌ Erreur de mise à jour:", error.message);
        return { success: false, error: error.message };
      }

      console.log("✅ Profil mis à jour avec succès");
      return { success: true, data };
      
    } catch (error: any) {
      console.error("💥 Erreur inattendue lors de la mise à jour:", error);
      return { success: false, error: "Erreur lors de la mise à jour" };
    }
  }, [supabase]);

  /**
   * 🔍 Propriétés calculées (computed properties)
   * 
   * Ces propriétés sont dérivées de l'état principal
   * Elles offrent une API plus riche et expressive
   */
  const isAuthenticated = !!user && !loading;
  const isLoading = loading;
  const userEmail = user?.email || null;
  const userId = user?.id || null;
  const userMetadata = user?.user_metadata || {};

  /**
   * 📤 API publique du hook
   * 
   * C'est ce que les composants recevront quand ils appellent useAuth()
   * Organisé en catégories pour une meilleure compréhension
   */
  return {
    // 📊 État actuel
    user,                    // Objet utilisateur complet de Supabase
    loading: isLoading,      // true pendant les opérations async
    error,                   // Message d'erreur si applicable
    
    // 🎯 Propriétés dérivées (pour simplifier l'usage)
    isAuthenticated,         // true si l'utilisateur est connecté ET loading terminé
    userEmail,              // Email de l'utilisateur ou null
    userId,                 // ID unique de l'utilisateur ou null
    userMetadata,           // Métadonnées personnalisées
    
    // 🎬 Actions d'authentification
    login,                  // (email, password) => Promise<AuthResponse>
    logout,                 // () => Promise<AuthResponse>
    register,               // (email, password, metadata?) => Promise<AuthResponse>
    resetPassword,          // (email) => Promise<AuthResponse>
    updateProfile,          // (updates) => Promise<AuthResponse>
    
    // 🔧 Accès avancé (pour des cas d'usage spécifiques)
    supabase               // Instance Supabase pour des opérations custom
  };
}