import type React from "react"
import { getCurrentUser } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar userRole={user.role} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
