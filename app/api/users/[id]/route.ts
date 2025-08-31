// app/api/users/[id]/route.ts (Adding PUT method)
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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
    const { email, firstName, lastName, role } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    // Prepare user_metadata update
    const user_metadata: { [key: string]: any } = {};
    if (firstName !== undefined) user_metadata.firstName = firstName;
    if (lastName !== undefined) user_metadata.lastName = lastName;
    if (role !== undefined) user_metadata.role = role; // Assuming role is part of user_metadata

    // Prepare app_metadata update (if role was in app_metadata)
    const app_metadata: { [key: string]: any } = {};
    // If role was in app_metadata, you would do: if (role !== undefined) app_metadata.role = role;

    const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      {
        email, // Email can be updated
        user_metadata: Object.keys(user_metadata).length > 0 ? user_metadata : undefined,
        // app_metadata: Object.keys(app_metadata).length > 0 ? app_metadata : undefined, // If role was in app_metadata
      }
    );

    if (error) {
      console.error(`Failed to update user with id ${id}:`, error);
      return NextResponse.json(
        { message: `Failed to update user: ${error.message}` },
        { status: 500 }
      );
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