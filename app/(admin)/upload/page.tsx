
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server"

import { UploadForm } from "@/components/admin/upload-form"

async function getUploadData(userId: string, userRole: string) {
  if (userRole === "superAdmin") {
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
  } else {
    // For classAdmin, only get fields they have access to
    const adminScopes = await prisma.adminScope.findMany({
      where: { userId },
      include: {
        field: {
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
        },
      },
    })

    // Filter semesters based on admin scope
    return adminScopes.map((scope) => ({
      ...scope.field,
      semesters: scope.field.semesters.filter((semester) => semester.number === scope.semesterNumber),
    }))
  }
}

export default async function UploadPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const userRole = user.user_metadata.role || ""

  const fields = await getUploadData(user.id, userRole)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Upload Resources</h1>
        <p className="text-muted-foreground">Add new files to the academic resource library</p>
      </div>

      <UploadForm fields={fields} userId={user.id} />
    </div>
  )
}
