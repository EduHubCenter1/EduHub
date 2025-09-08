import { prisma } from "@/lib/prisma";

export async function getAllSubmodules() {
  try {
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
  } catch (error) {
    console.error("Failed to fetch all submodules:", error);
    return [];
  }
}
