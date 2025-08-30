import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import slugify from "slugify"

// Function to generate a unique slug
async function generateUniqueSlug(
  name: string,
  submoduleId?: string
): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  const query: Prisma.submoduleWhereInput = {
    slug: uniqueSlug,
    NOT: {
      id: submoduleId,
    },
  }

  while (await prisma.submodule.findFirst({ where: query })) {
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
  const { name, moduleId } = body

  if (!name || !moduleId) {
    return NextResponse.json(
      { message: "Submodule name and module ID are required." },
      { status: 400 }
    )
  }

  try {
    const slug = await generateUniqueSlug(name, params.id)

    const updatedSubmodule = await prisma.submodule.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        moduleId,
      },
    })
    return NextResponse.json(updatedSubmodule, { status: 200 })
  } catch (error) {
    console.error(`Failed to update submodule with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A submodule with this name already exists for this module." },
        { status: 409 }
      )
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Submodule not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while updating the submodule." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.submodule.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Submodule successfully deleted." }, { status: 200 })
  } catch (error) {
    console.error(`Failed to delete submodule with id ${params.id}:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { message: "Submodule not found." },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while deleting the submodule." },
      { status: 500 }
    )
  }
}
