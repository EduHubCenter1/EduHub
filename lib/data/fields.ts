import { prisma } from "@/lib/prisma";
import { getAdminScopes } from "@/lib/data/admin-scopes";
import { User } from "@supabase/supabase-js";

export async function getFieldsForUser(user: User | null) {
  if (!user) {
    return [];
  }

  const userRole: string = user?.user_metadata?.role || '';

  try {
    if (userRole === 'superAdmin') {
      return await prisma.fields.findMany({
        orderBy: { name: "asc" },
      });
    } else if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return [];
      }
      const fieldIds = [...new Set(adminScopes.map(scope => scope.fieldId))];
      return await prisma.fields.findMany({
        where: {
          id: { in: fieldIds },
        },
        orderBy: { name: "asc" },
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch fields for user:", error);
    return [];
  }
}