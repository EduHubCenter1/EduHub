import { prisma } from "./prisma"

export interface SearchFilters {
  fieldId?: string
  semesterNumber?: number
  type?: string
  uploadedByUserId?: string
}

export interface SearchResult {
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

export interface SearchService {
  search(query: string, filters?: SearchFilters): Promise<SearchResult[]>
}

export class DatabaseSearchService implements SearchService {
  async search(query: string, filters: SearchFilters = {}): Promise<SearchResult[]> {
    const whereClause: any = {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    }

    // Apply filters
    if (filters.type) {
      whereClause.type = filters.type
    }

    if (filters.uploadedByUserId) {
      whereClause.uploadedByUserId = filters.uploadedByUserId
    }

    if (filters.fieldId || filters.semesterNumber) {
      whereClause.submodule = {
        module: {
          semester: {},
        },
      }

      if (filters.fieldId) {
        whereClause.submodule.module.semester.fieldId = filters.fieldId
      }

      if (filters.semesterNumber) {
        whereClause.submodule.module.semester.number = filters.semesterNumber
      }
    }

    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        uploadedBy: {
          select: { name: true },
        },
        submodule: {
          include: {
            module: {
              include: {
                semester: {
                  include: {
                    field: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { title: "asc" }],
      take: 50, // Limit results
    })

    return resources
  }
}

// Export singleton instance
export const searchService = new DatabaseSearchService()
