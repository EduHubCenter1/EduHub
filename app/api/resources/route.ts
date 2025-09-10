// app/api/resources/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resourceFormSchema } from "@/lib/validators";
import { z } from "zod";
import { getProfile } from "@/lib/actions/user.actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    let resources;
    if (status) {
      resources = await prisma.resource.findMany({
        where: { status: status as any }, // Cast to any for enum type
        include: {
          module: {
            include: {
              semester: {
                include: {
                  field: true,
                },
              },
            },
          },
          submodule: {
            include: {
              module: {
                include: {
                  semester: {
                    include: {
                      field: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      resources = await prisma.resource.findMany();
    }
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getProfile();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const json = await request.json();
    const data = resourceFormSchema.parse(json);

    const status = (user.role === 'superAdmin' || user.role === 'classAdmin') ? 'approved' : 'pending';

    const newResource = await prisma.resource.create({
      data: {
        title: data.title,
        type: data.type,
        description: data.description,
        moduleId: data.moduleId,
        submoduleId: data.submoduleId ? data.submoduleId : null,
        fileUrl: data.fileUrl,
        sizeBytes: data.sizeBytes,
        sha256: data.sha256,
        fileExt: data.fileExt,
        mimeType: data.mimeType,
        uploadedByUserId: user.id,
        status: status, // Default status
      },
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

