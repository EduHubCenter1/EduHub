import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentUploads } from "@/components/admin/recent-uploads"
import { QuickActions } from "@/components/admin/quick-actions"

async function getDashboardData(userId: string, userRole: string) {
  const baseQuery =
    userRole === "superAdmin"
      ? {}
      : {
          where: {
            submodule: {
              module: {
                semester: {
                  AND: [
                    {
                      field: {
                        adminScopes: {
                          some: { userId },
                        },
                      },
                    },
                    {
                      number: {
                        in: await prisma.adminScope
                          .findMany({
                            where: { userId },
                            select: { semesterNumber: true },
                          })
                          .then((scopes) => scopes.map((s) => s.semesterNumber)),
                      },
                    },
                  ],
                },
              },
            },
          },
        }

  const [totalResources, totalFields, totalModules, totalSubmodules, recentUploads] = await Promise.all([
    prisma.resource.count(baseQuery),
    userRole === "superAdmin" ? prisma.field.count() : prisma.adminScope.count({ where: { userId } }),
    userRole === "superAdmin"
      ? prisma.module.count()
      : prisma.module.count({
          where: {
            semester: {
              AND: [
                {
                  field: {
                    adminScopes: {
                      some: { userId },
                    },
                  },
                },
                {
                  number: {
                    in: await prisma.adminScope
                      .findMany({
                        where: { userId },
                        select: { semesterNumber: true },
                      })
                      .then((scopes) => scopes.map((s) => s.semesterNumber)),
                  },
                },
              ],
            },
          },
        }),
    userRole === "superAdmin"
      ? prisma.submodule.count()
      : prisma.submodule.count({
          where: {
            module: {
              semester: {
                AND: [
                  {
                    field: {
                      adminScopes: {
                        some: { userId },
                      },
                    },
                  },
                  {
                    number: {
                      in: await prisma.adminScope
                        .findMany({
                          where: { userId },
                          select: { semesterNumber: true },
                        })
                        .then((scopes) => scopes.map((s) => s.semesterNumber)),
                    },
                  },
                ],
              },
            },
          },
        }),
    prisma.resource.findMany({
      ...baseQuery,
      take: 5,
      orderBy: { createdAt: "desc" },
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
    }),
  ])

  return {
    stats: {
      totalResources,
      totalFields,
      totalModules,
      totalSubmodules,
    },
    recentUploads,
  }
}

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const userRole = user.user_metadata.role || ""
  const userName = user.user_metadata.name || user.email || "User"

  const data = await getDashboardData(user.id, userRole)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName}</p>
        </div>

        <DashboardStats stats={data.stats} userRole={userRole} />

        <div className="grid gap-8 md:grid-cols-2">
          <QuickActions userRole={userRole} />
          <RecentUploads uploads={data.recentUploads} />
        </div>
      </div>
    </AdminLayout>
  )
}
