interface SearchResult {
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
  submodule: {
    name: string
    slug: string
    module: {
      name: string
      slug: string
      semester: {
        number: number
        field: {
          name: string
          slug: string
        }
      }
    }
  }
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">No results found</p>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {results.map((resource) => (
          <div key={resource.id} className="space-y-4">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {resource.submodule.module.semester.field.name} • Semester{" "}
                      {resource.submodule.module.semester.number}
                    </p>
                    <p>
                      {resource.submodule.module.name} • {resource.submodule.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {resource.type}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase">{resource.fileExt}</span>
                </div>
              </div>

              {resource.description && <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>}

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  by {resource.uploadedBy.name} • {Math.round(resource.sizeBytes / 1024)} KB
                </span>
                <a
                  href={`/api/files/${resource.id}/download`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
