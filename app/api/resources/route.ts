import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod";
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { title: "asc" },
      include: {
        module: {
          select: {
            id: true,
            name: true,
            semester: {
              select: {
                id: true,
                number: true,
                fieldId: true,
                field: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        submodule: {
          select: {
            id: true,
            name: true,
            moduleId: true,
            module: {
              select: {
                id: true,
                name: true,
                semesterId: true,
                semester: {
                  select: {
                    id: true,
                    number: true,
                    fieldId: true,
                    field: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Failed to fetch resources:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "An error occurred while fetching resources.", error: errorMessage },
      { status: 500 }
    )
  }
}

// Schema for creating a new resource
const resourceCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string(), // Assuming type is validated elsewhere or is an enum
  description: z.string().optional(),
  moduleId: z.string(),
  submoduleId: z.string().nullable().optional(),
  fileUrl: z.string().url("Invalid file URL"),
  sizeBytes: z.number().int().min(0),
  sha256: z.string(),
  fileExt: z.string(),
  mimeType: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Incoming request body for /api/resources POST:", body);
    const validatedData = resourceCreateSchema.parse(body);

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const uploadedByUserId = user.id; // Use actual user ID

    const newResource = await prisma.resource.create({
      data: {
        title: validatedData.title,
        type: validatedData.type,
        description: validatedData.description,
        moduleId: validatedData.moduleId,
        submoduleId: validatedData.submoduleId,
        fileUrl: validatedData.fileUrl,
        sizeBytes: validatedData.sizeBytes,
        sha256: validatedData.sha256,
        fileExt: validatedData.fileExt,
        mimeType: validatedData.mimeType,
        uploadedByUserId: uploadedByUserId,
      },
    });

    return NextResponse.json(newResource, { status: 201 }); // 201 Created
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Failed to create resource:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "An error occurred while creating the resource.", error: errorMessage, details: error },
      { status: 500 }
    );
  }
}
