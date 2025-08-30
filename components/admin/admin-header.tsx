import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LogoutButton } from "@/components/auth/logout-button"
import { RoleBadge } from "@/components/auth/role-badge"
import { GraduationCap, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {SidebarTrigger} from "@/components/ui/sidebar";

interface AdminHeaderProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      {/*<div className="container mx-auto px-4 h-16 flex items-center justify-between">*/}
      {/*  <div className="flex items-center space-x-4">*/}
      {/*    <Link href="/admin" className="flex items-center space-x-2">*/}
      {/*      <GraduationCap className="h-8 w-8 text-primary" />*/}
      {/*      <span className="text-2xl font-bold font-heading text-primary">EduHub</span>*/}
      {/*      <span className="text-sm text-muted-foreground">Admin</span>*/}
      {/*      <SidebarTrigger className="-ml-1" />*/}
      {/*    </Link>*/}
      {/*  </div>*/}

      {/*  <div className="flex items-center space-x-4">*/}
      {/*    <Button asChild variant="ghost" size="sm">*/}
      {/*      <Link href="/">*/}
      {/*        <Home className="w-4 h-4 mr-2" />*/}
      {/*        Public Site*/}
      {/*      </Link>*/}
      {/*    </Button>*/}
      {/*    <RoleBadge role={user.role as "superAdmin" | "classAdmin"} />*/}
      {/*    <span className="text-sm text-muted-foreground">{user.name}</span>*/}
      {/*    <ThemeToggle />*/}
      {/*    <LogoutButton />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </header>
  )
}
