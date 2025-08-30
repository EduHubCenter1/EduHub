import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password, metadata } = await request.json()

  // Ensure service role key is available
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Server configuration error: Missing Supabase service role key' }, { status: 500 })
  }

  // Create a Supabase client with the service role
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,     
      email_confirm: true, // Automatically confirm the user's email
      user_metadata: metadata || {},
    })

    if (error) {
      let userFriendlyError = error.message
      if (error.message.includes('User already exists')) {
        userFriendlyError = "Un compte existe déjà avec cet email"
      }
      return NextResponse.json({ error: userFriendlyError }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      data, 
      message: "User created successfully!"
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error during user creation' }, { status: 500 })
  }
}
