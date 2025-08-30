import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import slugify from "slugify"

// Function to generate a unique slug
async function generateUniqueSlug(name: string): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  const query: Prisma.moduleWhereInput = {
    slug: uniqueSlug,
  }

  while (await prisma.module.findFirst({ where: query })) {
    uniqueSlug = `${slug}-${counter}`
    counter++
    query.slug = uniqueSlug
  }

  return uniqueSlug
}

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { name: "asc" },
      include: {
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
    })
    return NextResponse.json(modules)
  } catch (error) {
    console.error("Failed to fetch modules:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching modules." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, semesterId } = body

  if (!name || !semesterId) {
    return NextResponse.json(
      { message: "Module name and semester ID are required." },
      { status: 400 }
    )
  }

  try {
    const slug = await generateUniqueSlug(name)

    const newModule = await prisma.module.create({
      data: {
        name,
        slug,
        semesterId,
      },
    })
    return NextResponse.json(newModule, { status: 201 })
  } catch (error) {
    console.error("Failed to create module:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A module with this name already exists for this semester." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while creating the module." },
      { status: 500 }
    )
  }
}
