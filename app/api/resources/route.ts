import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
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
    })
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Failed to fetch resources:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "An error occurred while fetching resources.", error: errorMessage },
      { status: 500 }
    )
  }
}
