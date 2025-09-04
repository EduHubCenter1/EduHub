import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import slugify from "slugify"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getModulesForUser } from "@/lib/data/modules"

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

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const modules = await getModulesForUser(user);
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching modules." },
      { status: 500 }
    );
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