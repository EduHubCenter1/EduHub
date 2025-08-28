import { Badge } from "@/components/ui/badge"
import { Shield, ShieldCheck } from "lucide-react"

interface RoleBadgeProps {
  role: "superAdmin" | "classAdmin"
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === "superAdmin") {
    return (
      <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Super Admin
      </Badge>
    )
  }

  return (
    <Badge variant="secondary">
      <Shield className="w-3 h-3 mr-1" />
      Class Admin
    </Badge>
  )
}
