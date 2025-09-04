import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getAdminScopes } from "@/lib/data/admin-scopes";

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getResourcesForUser } from "@/lib/data/resources"

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
    const resources = await getResourcesForUser(user);
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "An error occurred while fetching resources.", error: errorMessage },
      { status: 500 }
    );
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
    if (body.submoduleId === '') {
      body.submoduleId = null;
    }
    const validatedData = resourceCreateSchema.parse(body);

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1]; // Extract JWT from "Bearer <token>"

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false, // Do not persist session in API routes
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole: string = user?.user_metadata?.role || '';

    if (userRole === 'classAdmin') {
      const adminScopes = await getAdminScopes(user.id);
      if (!adminScopes || adminScopes.length === 0) {
        return NextResponse.json({ message: "Admin scopes not found for classAdmin or user has no scopes" }, { status: 403 });
      }

      const targetModule = await prisma.module.findUnique({
        where: { id: validatedData.moduleId },
        include: {
          semester: true,
        },
      });

      if (!targetModule) {
        return NextResponse.json({ message: "Module not found" }, { status: 404 });
      }

      const isAuthorized = adminScopes.some((scope: any) =>
        scope.fieldId === targetModule.semester.fieldId &&
        scope.semesterId === targetModule.semester.id
      );

      if (!isAuthorized) {
        return NextResponse.json({ message: "Forbidden: Not authorized to create resources in this module's scope" }, { status: 403 });
      }
    } else if (userRole !== 'superAdmin') {
      return NextResponse.json({ message: "Forbidden: Only superAdmin and classAdmin can create resources" }, { status: 403 });
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