import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BookOpen, Folder, Calendar } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalResources: number
    totalFields: number
    totalModules: number
    totalSubmodules: number
  }
  userRole: string
}

export function DashboardStats({ stats, userRole }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Resources",
      value: stats.totalResources,
      icon: FileText,
      description: "Files uploaded",
    },
    {
      title: userRole === "superAdmin" ? "Fields" : "Assigned Classes",
      value: stats.totalFields,
      icon: BookOpen,
      description: userRole === "superAdmin" ? "Academic fields" : "Field-semester pairs",
    },
    {
      title: "Modules",
      value: stats.totalModules,
      icon: Calendar,
      description: "Course modules",
    },
    {
      title: "Submodules",
      value: stats.totalSubmodules,
      icon: Folder,
      description: "Resource categories",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
