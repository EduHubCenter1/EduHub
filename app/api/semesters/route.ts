
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

import { createClient } from "@supabase/supabase-js"

import { getAdminScopes } from "@/lib/data/admin-scopes"

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
    let semesters;
    if (userRole === 'superAdmin') {
      semesters = await prisma.semester.findMany({
        orderBy: { number: "asc" },
        include: {
          field: {
            select: {
              name: true,
            },
          },
        },
      });
    } else if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
      const semesterIds = [...new Set(adminScopes.map(scope => scope.semesterId))];
      semesters = await prisma.semester.findMany({
        where: {
          id: { in: semesterIds },
        },
        orderBy: { number: "asc" },
        include: {
          field: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(semesters)
  } catch (error) {
    console.error("Failed to fetch semesters:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching semesters." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { number, fieldId } = body

  if (!number || !fieldId) {
    return NextResponse.json(
      { message: "Semester number and field ID are required." },
      { status: 400 }
    )
  }

  try {
    const newSemester = await prisma.semester.create({
      data: {
        number: parseInt(number),
        fieldId: fieldId,
      },
    })
    return NextResponse.json(newSemester, { status: 201 })
  } catch (error) {
    console.error("Failed to create semester:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "A semester with this number already exists for this field." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred while creating the semester." },
      { status: 500 }
    )
  }
}
