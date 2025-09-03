import { Badge } from "@/components/ui/badge"
import { Shield, ShieldCheck } from "lucide-react"

interface RoleBadgeProps {
  role: "superAdmin" | "classAdmin"
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === "superAdmin") {
    return (
      <Badge variant="default" className="bg-blue-800 hover:bg-blue-900">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Super Admin
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
      <Shield className="w-3 h-3 mr-1" />
      Class Admin
    </Badge>
  )
}
