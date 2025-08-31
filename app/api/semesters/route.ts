
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET() {
  try {
    const semesters = await prisma.semester.findMany({
      orderBy: { number: "asc" },
      include: {
        field: {
          select: {
            name: true,
          },
        },
      },
    })
    return NextResponse.json(semesters)
  } catch (error) {
    console.error("Failed to fetch semesters:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching semesters." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { number, fieldId } = body

  if (!number || !fieldId) {
    return NextResponse.json(
      { message: "Semester number and field ID are required." },
      { status: 400 }
    )
  }

  try {
    const newSemester = await prisma.semester.create({
      data: {
        number: parseInt(number),
        fieldId: fieldId,
      },
    })
    return NextResponse.json(newSemester, { status: 201 })
  } catch (error) {
    console.error("Failed to create semester:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A semester with this number already exists for this field." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while creating the semester." },
      { status: 500 }
    )
  }
}
