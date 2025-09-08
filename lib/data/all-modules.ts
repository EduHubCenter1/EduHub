import { prisma } from "@/lib/prisma";

export async function getAllModules() {
  try {
    return await prisma.module.findMany({
      orderBy: { name: "asc" },
      include: {
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
    });
  } catch (error) {
    console.error("Failed to fetch all modules:", error);
    return [];
  }
}
