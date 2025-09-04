import { prisma } from "@/lib/prisma";
import { getAdminScopes } from "@/lib/data/admin-scopes";
import { User } from "@supabase/supabase-js";

export async function getResourcesForUser(user: User | null) {
  if (!user) {
    return [];
  }

  const userRole: string = user?.user_metadata?.role || '';

  try {
    if (userRole === 'superAdmin') {
      return await prisma.resource.findMany({
        orderBy: { title: "asc" },
        include: {
          module: {
            select: {
              id: true,
              name: true,
              semester: {
                select: {
                  id: true,
                  number: true,
                  fieldId: true,
                  field: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          submodule: {
            select: {
              id: true,
              name: true,
              moduleId: true,
              module: {
                select: {
                  id: true,
                  name: true,
                  semesterId: true,
                  semester: {
                    select: {
                      id: true,
                      number: true,
                      fieldId: true,
                      field: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
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
      const allowedModules = await prisma.module.findMany({
        where: {
          OR: allowedFieldSemesterPairs.map((pair: any) => ({
            semester: {
              fieldId: pair.fieldId,
              id: pair.semesterId,
            },
          })),
        },
        select: { id: true },
      });
      const allowedModuleIds = allowedModules.map(module => module.id);
      return await prisma.resource.findMany({
        where: {
          moduleId: { in: allowedModuleIds },
        },
        orderBy: { title: "asc" },
        include: {
          module: {
            select: {
              id: true,
              name: true,
              semester: {
                select: {
                  id: true,
                  number: true,
                  fieldId: true,
                  field: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          submodule: {
            select: {
              id: true,
              name: true,
              moduleId: true,
              module: {
                select: {
                  id: true,
                  name: true,
                  semesterId: true,
                  semester: {
                    select: {
                      id: true,
                      number: true,
                      fieldId: true,
                      field: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
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
    console.error("Failed to fetch resources for user:", error);
    return [];
  }
}
