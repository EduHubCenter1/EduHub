// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUsers, supabaseAdmin } from '@/lib/data/users'; // Import shared logic

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    // The error is already logged in getUsers, so we just return a generic error response
    return NextResponse.json(
      { message: "An error occurred while fetching users." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      adminScopes,
    } = await req.json();

    // --- 1. Validate input ---
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    if (role === 'classAdmin' && (!adminScopes || adminScopes.length === 0)) {
      return NextResponse.json({ message: 'Class Admins must have at least one scope.' }, { status: 400 });
    }

    // --- 2. Create user in Supabase Auth using the imported admin client ---
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        firstName,
        lastName,
        role,
      },
    });

    if (userError) {
      console.error('Supabase user creation failed:', userError);
      return NextResponse.json({ message: `Failed to create user: ${userError.message}` }, { status: 409 });
    }

    const newUser = userData.user;
    if (!newUser) {
      return NextResponse.json({ message: 'User created, but could not retrieve user data.' }, { status: 500 });
    }

    // --- 3. Create Admin Scopes in Prisma DB (if applicable) ---
    if (role === 'classAdmin' && adminScopes.length > 0) {
      try {
        await prisma.adminScope.createMany({
          data: adminScopes.map((scope: { fieldId: string; semesterNumber: number }) => ({
            userId: newUser.id,
            fieldId: scope.fieldId,
            semesterNumber: scope.semesterNumber,
          })),
        });
      } catch (dbError) {
        console.error('Prisma AdminScope creation failed:', dbError);
        // If scope creation fails, delete the orphaned Supabase user to keep things clean
        await supabaseAdmin.auth.admin.deleteUser(newUser.id);
        return NextResponse.json({ message: 'Failed to set user permissions. User creation has been rolled back.' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'User successfully created.' }, { status: 201 });

  } catch (error) {
    console.error('An unexpected error occurred during user creation:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
