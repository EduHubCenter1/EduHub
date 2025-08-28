import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { SidebarNav } from "./sidebar-nav"

async function getNavigationData() {
  return await prisma.field.findMany({
    orderBy: { name: "asc" },
    include: {
      semesters: {
        orderBy: { number: "asc" },
        include: {
          modules: {
            orderBy: { name: "asc" },
            include: {
              submodules: {
                orderBy: { name: "asc" },
              },
            },
          },
        },
      },
    },
  })
}

export async function PublicSidebar() {
  const fields = await getNavigationData()

  return (
    <aside className="w-80 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold font-heading mb-4">Navigation</h2>
        <Suspense fallback={<div>Loading navigation...</div>}>
          <SidebarNav fields={fields} />
        </Suspense>
      </div>
    </aside>
  )
}
