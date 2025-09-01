import { prisma } from '@/lib/prisma';

export async function getAdminScopes(userId: string) {
  if (!userId) return [];
  try {
    const adminScopes = await prisma.adminScope.findMany({
      where: { userId: userId },
      include: {
        field: true,
        semester: true,
      },
    });
    return adminScopes;
  } catch (error) {
    console.error('Error fetching admin scopes:', error);
    return []; // Return empty array on error
  }
}
