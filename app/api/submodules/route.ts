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
    let submodules;

    if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return NextResponse.json([], { status: 200 });
      }

      const allowedFieldSemesterPairs = adminScopes.map((scope: any) => ({
        fieldId: scope.fieldId,
        semesterId: scope.semesterId,
      }));

      submodules = await prisma.submodule.findMany({
        where: {
          module: {
            OR: allowedFieldSemesterPairs.map((pair: any) => ({
              semester: {
                fieldId: pair.fieldId,
                id: pair.semesterId,
              },
            })),
          }
        },
        orderBy: { name: "asc" },
        include: {
          module: {
            select: {
              name: true,
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
          },
        },
      });
    } else if (userRole === 'superAdmin') {
      submodules = await prisma.submodule.findMany({
        orderBy: { name: "asc" },
        include: {
          module: {
            select: {
              name: true,
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
          },
        },
      });
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(submodules)
  } catch (error) {
    console.error("Failed to fetch submodules:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching submodules." },
      { status: 500 }
    )
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
