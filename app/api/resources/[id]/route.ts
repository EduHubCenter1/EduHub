import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { promises as fs } from "fs"
import path from "path"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { title, type, description, submoduleId } = body

  if (!title || !type || !submoduleId) {
    return NextResponse.json(
      { message: "Title, type, and submodule ID are required." },
      { status: 400 }
    )
  }

  try {
    const updatedResource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        title,
        type,
        description,
        submoduleId,
      },
    })
    return NextResponse.json(updatedResource, { status: 200 })
  } catch (error) {
    console.error(`Failed to update resource with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Resource not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while updating the resource." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find the resource to get its fileUrl
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      select: { fileUrl: true },
    })

    if (!resource) {
      return NextResponse.json({ message: "Resource not found." }, { status: 404 })
    }

    // Delete the resource record from the database
    await prisma.resource.delete({ where: { id: params.id } })

    // Delete the associated file from the filesystem
    const filePath = path.join(process.env.UPLOADS_DIR || "./uploads", resource.fileUrl)
    try {
      await fs.unlink(filePath)
    } catch (fileError: any) {
      console.warn(`Failed to delete file ${filePath}:`, fileError.message)
      // Continue even if file deletion fails, as the DB record is gone
    }

    return NextResponse.json({ message: "Resource successfully deleted." }, { status: 200 })
  } catch (error) {
    console.error(`Failed to delete resource with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Resource not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while deleting the resource." },
      { status: 500 }
    )
  }
}
