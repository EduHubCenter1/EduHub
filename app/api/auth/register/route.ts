import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  // Only destructure fields from the public registration form
  const { email, password, firstName, lastName, username, institution, fieldOfStudy, academicLevel, profilePictureUrl } = await request.json()
  
  const role = "user"; // Always set role to 'user' for public registration

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // --- 1. Create User in Supabase Auth ---
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        role: role,
      },
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  if (signUpError) {
    console.error('Supabase registration error:', signUpError)
    if (signUpError.code === 'email_address_invalid') {
        return NextResponse.json({ error: 'The provided email address is invalid.' }, { status: 400 });
    }
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  if (!signUpData.user) {
    return NextResponse.json({ error: 'User not created in Supabase' }, { status: 500 })
  }

  const userId = signUpData.user.id;

  try {
    // --- 2. UPDATE the User Profile created by the trigger ---
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
        username,
        institution,
        fieldOfStudy,
        academicLevel,
        profilePictureUrl,
        role, // Save the 'user' role
      },
    })

    return NextResponse.json({ message: 'Registration successful', data: signUpData }, { status: 200 })

  } catch (error) {
    console.error('Error creating user profile:', error)
    
    // If profile creation fails, attempt to delete the user from Supabase Auth to prevent orphans
    const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            // For a server-to-server admin client, cookies are not required.
            cookies: {}, 
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error('CRITICAL: Failed to delete user from Supabase after profile creation error:', deleteError)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target as string[];
      const message = `A user with this ${target.join(', ')} already exists.`
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to save user profile.' }, { status: 500 })
  }
}

