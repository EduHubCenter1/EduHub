"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, BookOpen, Calendar, FileText, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavigationField {
  id: string
  name: string
  slug: string
  semesters: {
    id: string
    number: number
    modules: {
      id: string
      name: string
      slug: string
      submodules: {
        id: string
        name: string
        slug: string
      }[]
    }[]
  }[]
}

interface SidebarNavProps {
  fields: NavigationField[]
}

export function SidebarNav({ fields }: SidebarNavProps) {
  const pathname = usePathname()
  const [openFields, setOpenFields] = useState<Set<string>>(new Set())
  const [openSemesters, setOpenSemesters] = useState<Set<string>>(new Set())
  const [openModules, setOpenModules] = useState<Set<string>>(new Set())

  const toggleField = (fieldId: string) => {
    const newOpen = new Set(openFields)
    if (newOpen.has(fieldId)) {
      newOpen.delete(fieldId)
    } else {
      newOpen.add(fieldId)
    }
    setOpenFields(newOpen)
  }

  const toggleSemester = (semesterId: string) => {
    const newOpen = new Set(openSemesters)
    if (newOpen.has(semesterId)) {
      newOpen.delete(semesterId)
    } else {
      newOpen.add(semesterId)
    }
    setOpenSemesters(newOpen)
  }

  const toggleModule = (moduleId: string) => {
    const newOpen = new Set(openModules)
    if (newOpen.has(moduleId)) {
      newOpen.delete(moduleId)
    } else {
      newOpen.add(moduleId)
    }
    setOpenModules(newOpen)
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <Collapsible key={field.id} open={openFields.has(field.id)} onOpenChange={() => toggleField(field.id)}>
          <div className="flex items-center space-x-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                {openFields.has(field.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <Link
              href={`/fields/${field.slug}`}
              className={cn(
                "flex items-center space-x-2 text-sm hover:text-primary transition-colors flex-1",
                pathname === `/fields/${field.slug}` && "text-primary font-medium",
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span className="whitespace-normal break-words">{field.name}</span>
            </Link>
          </div>

          <CollapsibleContent className="ml-4 space-y-1">
            {field.semesters.map((semester) => (
              <Collapsible
                key={semester.id}
                open={openSemesters.has(semester.id)}
                onOpenChange={() => toggleSemester(semester.id)}
              >
                <div className="flex items-center space-x-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openSemesters.has(semester.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Link
                    href={`/fields/${field.slug}/semesters/${semester.number}`}
                    className={cn(
                      "flex items-center space-x-2 text-sm hover:text-primary transition-colors flex-1",
                      pathname === `/fields/${field.slug}/semesters/${semester.number}` && "text-primary font-medium",
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Semester {semester.number}</span>
                  </Link>
                </div>

                <CollapsibleContent className="ml-4 space-y-1">
                  {semester.modules.map((module) => (
                    <Collapsible
                      key={module.id}
                      open={openModules.has(module.id)}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-auto">
                            {openModules.has(module.id) ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <Link
                          href={`/fields/${field.slug}/semesters/${semester.number}/modules/${module.slug}`}
                          className={cn(
                            "flex items-center space-x-2 text-xs hover:text-primary transition-colors flex-1",
                            pathname === `/fields/${field.slug}/semesters/${semester.number}/modules/${module.slug}` &&
                              "text-primary font-medium",
                          )}
                        >
                          <FileText className="h-3 w-3" />
                          <span className="whitespace-normal break-words">{module.name}</span>
                        </Link>
                      </div>

                      <CollapsibleContent className="ml-4 space-y-1">
                        {module.submodules.map((submodule) => (
                          <Link
                            key={submodule.id}
                            href={`/fields/${field.slug}/semesters/${semester.number}/modules/${module.slug}/submodules/${submodule.slug}`}
                            className={cn(
                              "flex items-center space-x-2 text-xs hover:text-primary transition-colors block pl-4",
                              pathname ===
                                `/fields/${field.slug}/semesters/${semester.number}/modules/${module.slug}/submodules/${submodule.slug}` &&
                                "text-primary font-medium",
                            )}
                          >
                            <Folder className="h-3 w-3" />
                            <span className="whitespace-normal break-words">{submodule.name}</span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
