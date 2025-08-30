import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();

  const { email, password, metadata } = await request.json();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Store firstName, lastName, role in user_metadata
      },
    });

    if (error) {
      console.error("Supabase signup error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Optionally, you might want to send a verification email or handle other post-signup logic

    return NextResponse.json({
      message: "User registered successfully!",
      data: data.user,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error during registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
