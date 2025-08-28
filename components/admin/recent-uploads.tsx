import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatFileSize } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { FileText } from "lucide-react"

interface RecentUpload {
  id: string
  title: string
  type: string
  sizeBytes: number
  createdAt: Date
  uploadedBy: {
    name: string
  }
  submodule: {
    name: string
    module: {
      name: string
      semester: {
        number: number
        field: {
          name: string
        }
      }
    }
  }
}

interface RecentUploadsProps {
  uploads: RecentUpload[]
}

export function RecentUploads({ uploads }: RecentUploadsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>Latest files added to the system</CardDescription>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent uploads</p>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{upload.title}</p>
                    <Badge variant="secondary" className="ml-2">
                      {upload.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {upload.submodule.module.semester.field.name} • S{upload.submodule.module.semester.number} •{" "}
                    {upload.submodule.module.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      by {upload.uploadedBy.name} • {formatFileSize(upload.sizeBytes)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(upload.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
