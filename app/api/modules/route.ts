import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import slugify from "slugify"

// Function to generate a unique slug
import { createClient } from "@supabase/supabase-js"
import { getAdminScopes } from "@/lib/data/admin-scopes"

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
    let modules;

    if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return NextResponse.json([], { status: 200 });
      }

      const allowedFieldSemesterPairs = adminScopes.map((scope: any) => ({
        fieldId: scope.fieldId,
        semesterId: scope.semesterId,
      }));

      modules = await prisma.module.findMany({
        where: {
          OR: allowedFieldSemesterPairs.map((pair: any) => ({
            semester: {
              fieldId: pair.fieldId,
              id: pair.semesterId,
            },
          })),
        },
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
      });
    } else if (userRole === 'superAdmin') {
      modules = await prisma.module.findMany({
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
      });
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

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
