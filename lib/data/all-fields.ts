import { prisma } from "@/lib/prisma";

export async function getAllFields() {
  try {
    return await prisma.field.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch all fields:", error);
    return [];
  }
}
