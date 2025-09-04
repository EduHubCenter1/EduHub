import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getTotalFields,
  getTotalModules,
  getTotalResources,
  getTotalSuperAdmins,
  getTotalClassAdmins,
} from "@/lib/data-stats"
import { FolderGit, Library, Users, FileText, ShieldCheck } from "lucide-react"

export async function SectionCards() {
  const totalFields = await getTotalFields()
  const totalModules = await getTotalModules()
  const totalResources = await getTotalResources()
  const totalSuperAdmins = await getTotalSuperAdmins()
  const totalClassAdmins = await getTotalClassAdmins()

  const data = [
    {
      icon: <ShieldCheck className="size-10 text-muted-foreground" />,
      title: "Super Admins",
      content: totalSuperAdmins,
      description: "The total number of super administrators.",
    },
    {
      icon: <Users className="size-10 text-muted-foreground" />,
      title: "Class Admins",
      content: totalClassAdmins,
      description: "The total number of class administrators.",
    },
    {
      icon: <FolderGit className="size-10 text-muted-foreground" />,
      title: "Total Fields",
      content: totalFields,
      description: "The total number of fields available.",
    },
    {
      icon: <Library className="size-10 text-muted-foreground" />,
      title: "Total Modules",
      content: totalModules,
      description: "The total number of modules across all fields.",
    },
    {
      icon: <FileText className="size-10 text-muted-foreground" />,
      title: "Total Resources",
      content: totalResources,
      description: "The total number of resources in the system.",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
      {data.map((item, index) => (
        <Card
          key={index}
          className="transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">
                {item.title}
              </CardTitle>
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{item.content}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}