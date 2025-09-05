"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GraduationCap, Settings, LogOut, LayoutDashboard, ChevronDown, CircleUser, Mail } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext"; // ✅ utilisation du contexte
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function PublicHeader() {
  const { user, loading, logout } = useAuthContext(); // ✅ hook
  const { pathname } = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-xl shadow-indigo-500/50">
        <div className="mx-auto px-10 h-16 flex items-center justify-center">
          <Link href="/" className="flex items-center justify-center align-baseline space-x-2">
            <Image src="/sidebar.png" alt="EduHub Logo" width={130} height={130} />
          </Link>
        </div>
      </header>

      {/* User FAB */}
      <div className="fixed bottom-24 right-5 z-50">
        {loading ? (
          <Button variant="ghost" size="icon" className="h-16 w-16 rounded-full" disabled>
            ...
          </Button>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="icon" className="h-12 w-12 rounded-full hover:shadow-xl hover:shadow-primary/60 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/50">
                <CircleUser className="w-8 h-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </>
  );
}