import { prisma } from "@/lib/prisma";

export async function getAllSemesters() {
  try {
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
  } catch (error) {
    console.error("Failed to fetch all semesters:", error);
    return [];
  }
}
