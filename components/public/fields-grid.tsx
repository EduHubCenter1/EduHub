import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import { GiOpenBook } from "react-icons/gi";


interface Field {
  id: string
  name: string
  slug: string
  description: string | null
  _count: {
    semesters: number
  }
}

interface FieldsGridProps {
  fields: Field[]
}

export function FieldsGrid({ fields }: FieldsGridProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-heading mb-2">Academic Fields</h2>
        <p className="text-muted-foreground">Choose your field of study to explore resources</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <Link key={field.id} href={`/fields/${field.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
<GiOpenBook />
                  <Badge variant="secondary">{field._count.semesters} semesters</Badge>
                </div>
                <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors">
                  {field.name}
                </CardTitle>
                {field.description && <CardDescription>{field.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Click to explore semesters and resources</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
