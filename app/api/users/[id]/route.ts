// app/api/users/[id]/route.ts (Updated PUT method)
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import prisma client

// Create a single supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error(`Failed to delete user with id ${id}:`, error);
      return NextResponse.json(
        { message: `Failed to delete user: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "User successfully deleted." });
  } catch (error) {
    console.error("An unexpected error occurred during user deletion:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { email, firstName, lastName, role, adminScopes } = await req.json(); // Get adminScopes

    console.log("Received adminScopes in backend:", adminScopes);

    if (!id) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    // --- Update Supabase Auth User ---
    const user_metadata: { [key: string]: any } = {};
    if (firstName !== undefined) user_metadata.firstName = firstName;
    if (lastName !== undefined) user_metadata.lastName = lastName;
    if (role !== undefined) user_metadata.role = role;

    const { data: user, error: userUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      {
        email,
        user_metadata: Object.keys(user_metadata).length > 0 ? user_metadata : undefined,
      }
    );

    if (userUpdateError) {
      console.error(`Failed to update user with id ${id}:`, userUpdateError);
      return NextResponse.json(
        { message: `Failed to update user: ${userUpdateError.message}` },
        { status: 500 }
      );
    }

    // --- Update Admin Scopes (if provided) ---
    if (adminScopes && Array.isArray(adminScopes)) {
      const existingAdminScopes = await prisma.adminScope.findMany({
        where: { userId: id },
      });

      const scopesToCreate = adminScopes.filter(
        (newScope: any) => !existingAdminScopes.some(
          (existingScope) =>
            existingScope.fieldId === newScope.fieldId &&
            existingScope.semesterNumber === newScope.semesterNumber
        )
      );

      const scopesToDelete = existingAdminScopes.filter(
        (existingScope) => !adminScopes.some(
          (newScope: any) =>
            newScope.fieldId === existingScope.fieldId &&
            newScope.semesterNumber === existingScope.semesterNumber
        )
      );

      // Perform deletions
      if (scopesToDelete.length > 0) {
        await prisma.adminScope.deleteMany({
          where: {
            id: {
              in: scopesToDelete.map(scope => scope.id),
            },
          },
        });
      }

      // Perform creations
      if (scopesToCreate.length > 0) {
        await prisma.adminScope.createMany({
          data: scopesToCreate.map((scope: any) => ({
            userId: id,
            fieldId: scope.fieldId,
            semesterNumber: scope.semesterNumber,
          })),
        });
      }
    }

    return NextResponse.json({ message: "User successfully updated.", user });
  } catch (error) {
    console.error("An unexpected error occurred during user update:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
