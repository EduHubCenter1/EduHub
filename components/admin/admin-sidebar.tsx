import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Upload, Users, Settings, FileText, Folder } from "lucide-react"

interface AdminSidebarProps {
  userRole: string
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["superAdmin", "classAdmin"] },
  { name: "Upload Resources", href: "/admin/upload", icon: Upload, roles: ["superAdmin", "classAdmin"] },
  { name: "Manage Fields", href: "/admin/fields", icon: BookOpen, roles: ["superAdmin"] },
  { name: "Manage Modules", href: "/admin/modules", icon: FileText, roles: ["superAdmin", "classAdmin"] },
  { name: "Manage Submodules", href: "/admin/submodules", icon: Folder, roles: ["superAdmin", "classAdmin"] },
  { name: "User Management", href: "/admin/users", icon: Users, roles: ["superAdmin"] },
  { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["superAdmin"] },
]

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const filteredNavigation = navigation.filter((item) => item.roles.includes(userRole))

  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {filteredNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
