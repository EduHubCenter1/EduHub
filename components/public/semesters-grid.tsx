import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface Semester {
  id: string
  number: number
  _count: {
    modules: number
  }
}

interface SemestersGridProps {
  fieldSlug: string
  semesters: Semester[]
}

export function SemestersGrid({ fieldSlug, semesters }: SemestersGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {semesters.map((semester) => (
        <Link key={semester.id} href={`/fields/${fieldSlug}/semesters/${semester.number}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Calendar className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
                <Badge variant="secondary">{semester._count.modules} modules</Badge>
              </div>
              <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors">
                Semester {semester.number}
              </CardTitle>
              <CardDescription>Explore modules and resources for this semester</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}