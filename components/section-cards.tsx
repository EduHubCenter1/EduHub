import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getTotalFields,
  getTotalModules,
  getTotalResources,
  getTotalUsers,
} from "@/lib/data-stats"
import { FolderGit, Library, Users } from "lucide-react"

export async function SectionCards() {
  const totalUsers = await getTotalUsers()
  const totalFields = await getTotalFields()
  const totalModules = await getTotalModules()
  const totalResources = await getTotalResources()

  const data = [
    {
      icon: <Users className="size-8 text-muted-foreground" />,
      title: "Total Users",
      content: totalUsers,
      description: "The total number of users in the system.",
    },
    {
      icon: <FolderGit className="size-8 text-muted-foreground" />,
      title: "Total Fields",
      content: totalFields,
      description: "The total number of fields available.",
    },
    {
      icon: <Library className="size-8 text-muted-foreground" />,
      title: "Total Modules",
      content: totalModules,
      description: "The total number of modules across all fields.",
    },
    {
      icon: <Users className="size-8 text-muted-foreground" />,
      title: "Total Resources",
      content: totalResources,
      description: "The total number of resources available for download.",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6">
      {data.map((item, index) => (
        <Card key={index} className="shadow-xs">
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {item.title}
              </CardTitle>
              {item.icon}
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-3xl font-bold">{item.content}</div>
            <p className="text-muted-foreground">{item.description}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
