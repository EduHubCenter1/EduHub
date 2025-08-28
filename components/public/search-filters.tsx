"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Field {
  id: string
  name: string
  slug: string
}

interface SearchFiltersProps {
  fields: Field[]
  currentFilters: {
    fieldId?: string
    semesterNumber?: number
    type?: string
  }
  query: string
}

const resourceTypes = [
  { value: "course", label: "Course Material" },
  { value: "exam", label: "Exam" },
  { value: "tp_exercise", label: "TP/Exercise" },
  { value: "project", label: "Project" },
  { value: "presentation", label: "Presentation" },
  { value: "report", label: "Report" },
  { value: "other", label: "Other" },
]

const semesters = [1, 2, 3, 4, 5, 6]

export function SearchFilters({ fields, currentFilters, query }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("q", query)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/search?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const hasActiveFilters = currentFilters.fieldId || currentFilters.semesterNumber || currentFilters.type

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Narrow down your search results</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Field</label>
          <Select
            value={currentFilters.fieldId || "allFields"}
            onValueChange={(value) => updateFilter("fieldId", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allFields">All fields</SelectItem>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Semester</label>
          <Select
            value={currentFilters.semesterNumber?.toString() || "allSemesters"}
            onValueChange={(value) => updateFilter("semesterNumber", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allSemesters">All semesters</SelectItem>
              {semesters.map((semester) => (
                <SelectItem key={semester} value={semester.toString()}>
                  Semester {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Resource Type</label>
          <Select
            value={currentFilters.type || "allTypes"}
            onValueChange={(value) => updateFilter("type", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allTypes">All types</SelectItem>
              {resourceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {currentFilters.fieldId && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter("fieldId", null)}>
                  {fields.find((f) => f.id === currentFilters.fieldId)?.name}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {currentFilters.semesterNumber && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => updateFilter("semesterNumber", null)}
                >
                  Semester {currentFilters.semesterNumber}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {currentFilters.type && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter("type", null)}>
                  {resourceTypes.find((t) => t.value === currentFilters.type)?.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
