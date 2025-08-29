"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { GraduationCap, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function PublicHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // ✅ Ajouté
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // ✅ NOUVEAU - Récupérer la session actuelle au montage
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session récupérée:', session?.user);
      setUser(session?.user || null);
      setLoading(false); // ✅ Ajouté
    };

    getSession(); // ✅ NOUVEAU - Appel crucial

    // Écoute des changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('onAuthStateChange fired:', session?.user);
      setUser(session?.user || null);
      setLoading(false); // ✅ Ajouté
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-heading text-primary">EduHub</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* ✅ MODIFIÉ - Affichage conditionnel avec loading */}
          {loading ? (
            <Button variant="outline" size="sm" disabled>
              ...
            </Button>
          ) : user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}