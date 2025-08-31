// app/api/users/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create a single supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error("Failed to fetch users:", error)
      return NextResponse.json(
        { message: "An error occurred while fetching users." },
        { status: 500 }
      )
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching users." },
      { status: 500 }
    )
  }
}
