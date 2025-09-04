import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import slugify from "slugify"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSubmodulesForUser } from "@/lib/data/submodules"

// Function to generate a unique slug
async function generateUniqueSlug(name: string): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true })
  let uniqueSlug = slug
  let counter = 1

  const query: Prisma.submoduleWhereInput = {
    slug: uniqueSlug,
  }

  while (await prisma.submodule.findFirst({ where: query })) {
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
    const submodules = await getSubmodulesForUser(user);
    return NextResponse.json(submodules);
  } catch (error) {
    console.error("Failed to fetch submodules:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching submodules." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, moduleId } = body

  if (!name || !moduleId) {
    return NextResponse.json(
      { message: "Submodule name and module ID are required." },
      { status: 400 }
    )
  }

  try {
    const slug = await generateUniqueSlug(name)

    const newSubmodule = await prisma.submodule.create({
      data: {
        name,
        slug,
        moduleId,
      },
    })
    return NextResponse.json(newSubmodule, { status: 201 })
  } catch (error) {
    console.error("Failed to create submodule:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A submodule with this name already exists for this module." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while creating the submodule." },
      { status: 500 }
    )
  }
}