import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const fields = await prisma.user.findMany(); // <-- récupère toutes les lignes
    return NextResponse.json(fields);
  } catch (error) {
    console.error("Error fetching fields:", error);
    return NextResponse.json({ message: "Failed to fetch fields" }, { status: 500 });
  }
}
