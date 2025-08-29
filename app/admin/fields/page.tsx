
import { prisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { FieldsTable } from "@/components/admin/fields-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getFields() {
  return await prisma.field.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          semesters: true,
        },
      },
    },
  })
}

export default async function FieldsPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== "superAdmin") {
    // You might want to redirect to a 403 page or login page
    // For now, let's just throw an error or redirect to login
    throw new Error("Unauthorized: Super Admin access required.")
  }
  const fields = await getFields()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manage Fields</h1>
            <p className="text-muted-foreground">Academic fields and their semesters</p>
          </div>
          <Button asChild>
            <Link href="/admin/fields/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Link>
          </Button>
        </div>

        <FieldsTable fields={fields} />
      </div>
    </AdminLayout>
  )
}
