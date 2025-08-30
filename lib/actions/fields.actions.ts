"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import slugify from "slugify"

import {prisma} from "@/lib/prisma"
import { fieldFormSchema } from "@/lib/validators"

// Function to generate a unique slug
async function generateUniqueSlug(name: string, fieldId?: string): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  const query: Prisma.FieldWhereInput = {
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

// GET actions
export async function getFields() {
  try {
    return await prisma.fields.findMany({
      orderBy: { name: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch fields:", error)
    throw new Error("An error occurred while fetching fields.")
  }
}

export async function getFieldById(id: string) {
  try {
    return await prisma.fields.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error(`Failed to fetch field with id ${id}:`, error)
    throw new Error("An error occurred while fetching the field.")
  }
}

// UPSERT action (Create/Update)
export async function upsertField(data: { id?: string; name: string; description?: string | null }) {
  const validatedFields = fieldFormSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Could not upsert field.",
    }
  }

  const { id, name, description } = validatedFields.data

  try {
    const slug = await generateUniqueSlug(name, id)

    const result = await prisma.fields.upsert({
      where: { id: id || "" }, // Provide a dummy id for creation
      create: {
        name,
        slug,
        description,
      },
      update: {
        name,
        slug,
        description,
      },
    })

    revalidatePath("/(admin)/dashboard/fields")

    return {
      data: result,
      message: `Field successfully ${id ? "updated" : "created"}.`,
    }
  } catch (error) {
    console.error("Upsert field failed:", error)
    // @ts-ignore
    if (error.code === "P2002") { // Unique constraint violation
      return {
        message: "A field with this name already exists.",
      }
    }
    return {
      message: "An unexpected error occurred.",
    }
  }
}

// DELETE action
export async function deleteField(id: string) {
  try {
    await prisma.fields.delete({ where: { id } })
    revalidatePath("/(admin)/dashboard/fields")
    return { message: "Field successfully deleted." }
  } catch (error) {
    console.error("Delete field failed:", error)
    return {
      message: "Failed to delete field. It might be associated with other records.",
    }
  }
}
