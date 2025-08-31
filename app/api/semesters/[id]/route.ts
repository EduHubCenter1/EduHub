import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { number, fieldId } = body

  if (!number || !fieldId) {
    return NextResponse.json(
      { message: "Semester number and field ID are required." },
      { status: 400 }
    )
  }

  try {
    const updatedSemester = await prisma.semester.update({
      where: { id: params.id },
      data: {
        number: parseInt(number),
        fieldId: fieldId,
      },
    })
    return NextResponse.json(updatedSemester, { status: 200 })
  } catch (error) {
    console.error(`Failed to update semester with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A semester with this number already exists for this field." },
        { status: 409 }
      )
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Semester not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while updating the semester." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.semester.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Semester successfully deleted." }, { status: 200 })
  } catch (error) {
    console.error(`Failed to delete semester with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Semester not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while deleting the semester." },
      { status: 500 }
    )
  }
}
