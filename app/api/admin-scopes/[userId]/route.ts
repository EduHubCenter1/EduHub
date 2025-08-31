// app/api/admin-scopes/[userId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    const adminScopes = await prisma.adminScope.findMany({
      where: { userId: userId },
      include: {
        field: {
          select: {
            id: true, // Include ID for selection in form
            name: true,
          },
        },
      },
    });

    return NextResponse.json(adminScopes);
  } catch (error) {
    console.error(`Failed to fetch admin scopes for user ${userId}:`, error);
    return NextResponse.json(
      { message: "An error occurred while fetching admin scopes." },
      { status: 500 }
    );
  }
}
