import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import slugify from "slugify"

// Function to generate a unique slug
async function generateUniqueSlug(
  name: string,
  moduleId?: string
): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  const query: Prisma.moduleWhereInput = {
    slug: uniqueSlug,
    NOT: {
      id: moduleId,
    },
  }

  while (await prisma.module.findFirst({ where: query })) {
    uniqueSlug = `${slug}-${counter}`
    counter++
    query.slug = uniqueSlug
  }

  return uniqueSlug
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { name, semesterId } = body

  if (!name || !semesterId) {
    return NextResponse.json(
      { message: "Module name and semester ID are required." },
      { status: 400 }
    )
  }

  try {
    const slug = await generateUniqueSlug(name, params.id)

    const updatedModule = await prisma.module.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        semesterId,
      },
    })
    return NextResponse.json(updatedModule, { status: 200 })
  } catch (error) {
    console.error(`Failed to update module with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A module with this name already exists for this semester." },
        { status: 409 }
      )
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Module not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while updating the module." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.module.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Module successfully deleted." }, { status: 200 })
  } catch (error) {
    console.error(`Failed to delete module with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Module not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while deleting the module." },
      { status: 500 }
    )
  }
}
