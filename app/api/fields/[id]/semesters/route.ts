import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const fieldId = params.id;

    if (!fieldId) {
      return NextResponse.json({ message: "Field ID is required" }, { status: 400 });
    }

    const semesters = await prisma.semesters.findMany({
      where: {
        fieldId: fieldId,
      },
    });

    return NextResponse.json(semesters);
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
