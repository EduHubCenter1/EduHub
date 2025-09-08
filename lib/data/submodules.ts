import { prisma } from "@/lib/prisma";
import { getAdminScopes } from "@/lib/data/admin-scopes";
import { User } from "@supabase/supabase-js";

export async function getSubmodulesForUser(user: User | null) {
  if (!user) {
    return [];
  }

  const userRole: string = user?.user_metadata?.role || '';

  try {
    if (userRole === 'superAdmin') {
      return await prisma.submodule.findMany({
        orderBy: { name: "asc" },
        include: {
          module: {
            select: {
              name: true,
              semester: {
                select: {
                  number: true,
                  field: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return [];
      }
      const allowedFieldSemesterPairs = adminScopes.map((scope: any) => ({
        fieldId: scope.fieldId,
        semesterId: scope.semesterId,
      }));
      return await prisma.submodule.findMany({
        where: {
          module: {
            OR: allowedFieldSemesterPairs.map((pair: any) => ({
              semester: {
                fieldId: pair.fieldId,
                id: pair.semesterId,
              },
            })),
          }
        },
        orderBy: { name: "asc" },
        include: {
          module: {
            select: {
              name: true,
              semester: {
                select: {
                  number: true,
                  field: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch submodules for user:", error);
    return [];
  }
}