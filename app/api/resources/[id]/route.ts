import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Define a schema for the update payload
const resourceUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  type: z.string().optional(), // Assuming type is validated elsewhere or is an enum
  description: z.string().optional(),
  moduleId: z.string().optional(),
  submoduleId: z.string().nullable().optional(),
  fileUrl: z.string().url("Invalid file URL").optional(),
  sizeBytes: z.number().int().min(0).optional(),
  sha256: z.string().optional(),
  fileExt: z.string().optional(),
  mimeType: z.string().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const resourceId = params.id;
  if (!resourceId) {
    return NextResponse.json({ message: "Resource ID is required." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validatedData = resourceUpdateSchema.parse(body);

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: validatedData,
    });

    return NextResponse.json(updatedResource, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error(`Failed to update resource ${resourceId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "An error occurred while updating the resource.", error: errorMessage },
      { status: 500 }
    );
  }
}