// app/api/users/[id]/route.ts
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
