// app/api/resources/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
