import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { GraduationCap, Settings } from "lucide-react"

export function PublicHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-heading text-primary">EduHub</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/login">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
