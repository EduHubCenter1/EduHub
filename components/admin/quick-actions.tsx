import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Plus, Users, Settings } from "lucide-react"

interface QuickActionsProps {
  userRole: string
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const actions = [
    {
      title: "Upload Resources",
      description: "Add new files to the system",
      href: "/admin/upload",
      icon: Upload,
      roles: ["superAdmin", "classAdmin"],
    },
    {
      title: "Create Field",
      description: "Add a new academic field",
      href: "/admin/fields/new",
      icon: Plus,
      roles: ["superAdmin"],
    },
    {
      title: "Manage Users",
      description: "Add or edit admin users",
      href: "/admin/users",
      icon: Users,
      roles: ["superAdmin"],
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      href: "/admin/settings",
      icon: Settings,
      roles: ["superAdmin"],
    },
  ]

  const filteredActions = actions.filter((action) => action.roles.includes(userRole))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredActions.map((action) => (
          <Button key={action.title} asChild variant="outline" className="w-full justify-start bg-transparent">
            <Link href={action.href}>
              <action.icon className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
