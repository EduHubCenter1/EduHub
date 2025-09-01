"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { SidebarNav } from "./sidebar-nav"

// This should match the structure of the data fetched in the layout
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

interface FieldResponsiveSidebarProps {
  field: NavigationField
}

export function FieldResponsiveSidebar({ field }: FieldResponsiveSidebarProps) {
  return (
    <>
      {/* Mobile: A button to open the sheet */}
      <div className="lg:hidden p-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Menu className="h-5 w-5 mr-2" />
              <span>Explore {field.name}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-4 overflow-y-auto">
            <SheetTitle className="sr-only">Navigation for {field.name}</SheetTitle>
            <h2 className="text-lg font-semibold font-heading mb-4">{field.name}</h2>
            <SidebarNav fields={[field]} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: A permanent sidebar */}
      <aside className="hidden lg:block w-80 border-r bg-card/50 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold font-heading mb-4">{field.name}</h2>
          <SidebarNav fields={[field]} />
        </div>
      </aside>
    </>
  )
}
