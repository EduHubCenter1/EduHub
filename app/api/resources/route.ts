import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { title: "asc" },
      include: {
        submodule: {
          select: {
            name: true,
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
        },
      },
    })
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Failed to fetch resources:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching resources." },
      { status: 500 }
    )
  }
}
