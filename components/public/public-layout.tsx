import type React from "react"
import { PublicHeader } from "./public-header"
import { PublicSidebar } from "./public-sidebar"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="flex">
        <PublicSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
