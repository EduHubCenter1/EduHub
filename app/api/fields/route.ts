import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import slugify from "slugify"

import { prisma } from "@/lib/prisma"
import { fieldFormSchema } from "@/lib/validators"

import { createClient } from "@supabase/supabase-js"

import { getAdminScopes } from "@/lib/data/admin-scopes"

// Function to generate a unique slug
async function generateUniqueSlug(name: string): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  const query: Prisma.fieldsWhereInput = {
    slug: uniqueSlug,
  }

  while (await prisma.fields.findFirst({ where: query })) {
    uniqueSlug = `${slug}-${counter}`
    counter++
    query.slug = uniqueSlug
  }

  return uniqueSlug
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const userRole: string = user?.user_metadata?.role || ''

  try {
    let fields;
    if (userRole === 'superAdmin') {
      fields = await prisma.fields.findMany({
        orderBy: { name: "asc" },
      })
    } else if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
      const fieldIds = [...new Set(adminScopes.map(scope => scope.fieldId))];
      fields = await prisma.fields.findMany({
        where: {
          id: { in: fieldIds },
        },
        orderBy: { name: "asc" },
      });
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(fields)
  } catch (error) {
    console.error("Failed to fetch fields:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching fields." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const validatedFields = fieldFormSchema.safeParse(body)

  if (!validatedFields.success) {
    return NextResponse.json(
      {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed. Could not create field.",
      },
      { status: 400 }
    )
  }

  const { name, description } = validatedFields.data

  try {
    const slug = await generateUniqueSlug(name)

    const result = await prisma.fields.create({
      data: {
        name,
        slug,
        description,
      },
    })

    revalidatePath("/(admin)/dashboard/fields")

    return NextResponse.json(
      {
        data: result,
        message: "Field successfully created.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create field failed:", error)
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