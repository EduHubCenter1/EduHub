import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import slugify from "slugify"

import { prisma } from "@/lib/prisma"
import { fieldFormSchema } from "@/lib/validators"

// Function to generate a unique slug
async function generateUniqueSlug(
  name: string,
  fieldId?: string
): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  const query: Prisma.fieldsWhereInput = {
    slug: uniqueSlug,
    NOT: {
      id: fieldId,
    },
  }

  while (await prisma.fields.findFirst({ where: query })) {
    uniqueSlug = `${slug}-${counter}`
    counter++
    query.slug = uniqueSlug
  }

  return uniqueSlug
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const field = await prisma.fields.findUnique({
      where: { id: params.id },
    })
    if (!field) {
      return NextResponse.json({ message: "Field not found" }, { status: 404 })
    }
    return NextResponse.json(field)
  } catch (error) {
    console.error(`Failed to fetch field with id ${params.id}:`, error)
    return NextResponse.json(
      { message: "An error occurred while fetching the field." },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const validatedFields = fieldFormSchema.safeParse(body)

  if (!validatedFields.success) {
    return NextResponse.json(
      {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed. Could not update field.",
      },
      { status: 400 }
    )
  }

  const { name, description } = validatedFields.data

  try {
    const slug = await generateUniqueSlug(name, params.id)

    const result = await prisma.fields.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
      },
    })

    revalidatePath("/(admin)/dashboard/fields")
    revalidatePath("/")
    revalidatePath("/fields")

    return NextResponse.json({
      data: result,
      message: "Field successfully updated.",
    })
  } catch (error) {
    console.error(`Update field with id ${params.id} failed:`, error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A field with this name already exists." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fields.delete({ where: { id: params.id } })
    revalidatePath("/(admin)/dashboard/fields")
    return NextResponse.json({ message: "Field successfully deleted." })
  } catch (error) {
    console.error(`Delete field with id ${params.id} failed:`, error)
    return NextResponse.json(
      {
        message:
          "Failed to delete field. It might be associated with other records.",
      },
      { status: 500 }
    )
  }
}
