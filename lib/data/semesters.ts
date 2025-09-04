import { prisma } from "@/lib/prisma";
import { getAdminScopes } from "@/lib/data/admin-scopes";
import { User } from "@supabase/supabase-js";

export async function getSemestersForUser(user: User | null) {
  if (!user) {
    return [];
  }

  const userRole: string = user?.user_metadata?.role || '';

  try {
    if (userRole === 'superAdmin') {
      return await prisma.semester.findMany({
        orderBy: { number: "asc" },
        include: {
          field: {
            select: {
              name: true,
            },
          },
        },
      });
    } else if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return [];
      }
      const semesterIds = [...new Set(adminScopes.map(scope => scope.semesterId))];
      return await prisma.semester.findMany({
        where: {
          id: { in: semesterIds },
        },
        orderBy: { number: "asc" },
        include: {
          field: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch semesters for user:", error);
    return [];
  }
}
