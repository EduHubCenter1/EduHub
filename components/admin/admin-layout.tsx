import type React from "react"

import { redirect } from "next/navigation"
import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"
import { createSupabaseServerClient } from "@/lib/supabase/server"

interface AdminLayoutProps {
  children: React.ReactNode
}

export async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const userWithRole = {
    ...user,
    role: user.user_metadata.role || "",
    name: user.user_metadata.name || user.email || "User",
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={userWithRole} />
      <div className="flex">
        <AdminSidebar userRole={userWithRole.role} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
