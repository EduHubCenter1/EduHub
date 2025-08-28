import { ResourceCard } from "./resource-card"

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

interface ResourcesGridProps {
  resources: Resource[]
  title?: string
  description?: string
}

export function ResourcesGrid({ resources, title = "Resources", description }: ResourcesGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">No resources found</p>
          <p>This section doesn't have any resources yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-heading mb-2">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}
