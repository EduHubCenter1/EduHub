import type React from "react"

interface PublicLayoutWithoutSidebarProps {
  children: React.ReactNode
}

export function PublicLayoutWithoutSidebar({ children }: PublicLayoutWithoutSidebarProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
