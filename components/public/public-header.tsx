"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { GraduationCap, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext"; // ✅ utilisation du contexte

export function PublicHeader() {
  const { user, loading, logout } = useAuthContext(); // ✅ hook

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/newlogo.png" alt="EduHub Logo" width={200} height={200} />
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* ✅ Utilisation du hook */}
          {loading ? (
            <Button variant="outline" size="sm" disabled>
              ...
            </Button>
          ) : user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <p className={'hidden md:flex'}>Dashboard</p>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <p className={'hidden md:flex'}>Déconnexion</p>
              </Button>
            </>
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