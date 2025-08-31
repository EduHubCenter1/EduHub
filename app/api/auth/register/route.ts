import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.json()
  const email = formData.email as string
  const password = formData.password as string
  const metadata = formData.metadata || {}
  const { role, fieldId, semesterNumber } = metadata

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

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Pass all metadata to Supabase
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      console.error('Supabase registration error:', signUpError)
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    if (!signUpData.user) {
      return NextResponse.json({ error: 'User not created' }, { status: 500 })
    }

    // If the user is a classAdmin, create an admin scope
    if (role === 'classAdmin' && fieldId && semesterNumber) {
      try {
        await prisma.adminScope.create({
          data: {
            userId: signUpData.user.id,
            fieldId: fieldId,
            semesterNumber: semesterNumber,
          },
        })
      } catch (prismaError) {
        console.error('Failed to create admin scope:', prismaError)
        // Optional: Delete the user if scope creation fails to avoid inconsistent state
        await supabase.auth.admin.deleteUser(signUpData.user.id)
        return NextResponse.json({ error: 'Failed to assign admin scope.' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Registration successful', data: signUpData }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error during registration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
