import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSemestersForUser } from "@/lib/data/semesters"

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
    const semesters = await getSemestersForUser(user);
    return NextResponse.json(semesters);
  } catch (error) {
    console.error("Failed to fetch semesters:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching semesters." },
      { status: 500 }
    );
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