import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, ImageIcon, Video, Archive, File } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Resource {
  id: string
  title: string
  type: string
  description: string | null
  fileExt: string
  mimeType: string
  sizeBytes: number
  createdAt: Date
  uploadedBy: {
    name: string
  }
}

interface ResourceCardProps {
  resource: Resource
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon
  if (mimeType.startsWith("video/")) return Video
  if (mimeType.includes("zip") || mimeType.includes("archive")) return Archive
  if (mimeType === "application/pdf" || mimeType.includes("document")) return FileText
  return File
}

function getResourceTypeLabel(type: string) {
  const labels: Record<string, string> = {
    course: "Course",
    exam: "Exam",
    tp_exercise: "TP/Exercise",
    project: "Project",
    presentation: "Presentation",
    report: "Report",
    other: "Other",
  }
  return labels[type] || type
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const FileIcon = getFileIcon(resource.mimeType)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <FileIcon className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">{getResourceTypeLabel(resource.type)}</Badge>
                <span className="text-xs text-muted-foreground uppercase">{resource.fileExt}</span>
              </div>
            </div>
          </div>
        </div>
        {resource.description && <CardDescription className="mt-2">{resource.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p>{formatFileSize(resource.sizeBytes)}</p>
            <p>Added {formatDistanceToNow(resource.createdAt, { addSuffix: true })}</p>
          </div>
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/api/files/${resource.id}/download`}>
              <Download className="w-4 h-4 mr-2" />
              Grab file
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
