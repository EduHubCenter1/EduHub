"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="mx-auto px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center justify-center align-baseline space-x-2">
          <Image src="/newlogo.png" alt="EduHub Logo" width={60} height={60} />
        </Link>

        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Link>
          </Button>
          

          {/* ✅ Utilisation du hook */}
          {loading ? (
            <Button variant="outline" size="sm" disabled>
              ...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <CircleUser className="w-4 h-4 mr-2" />
                  {user.user_metadata?.firstName && user.user_metadata?.lastName
                    ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
                    : user.email}
                  <ChevronDown className="ml-2 h-4 w-4" />
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