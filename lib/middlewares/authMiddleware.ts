import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '../supabase/middleware'

export async function handleAuth(request: NextRequest) {
    let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
const supabase = createSupabaseMiddlewareClient(request, response)
      
const { data: { user } } = await supabase.auth.getUser();

const {data:{ session }} = await supabase.auth.getSession()

const { pathname } = request.nextUrl

const userRole: string = user?.user_metadata?.role || '';
  
const allowedAdminRoles = ['superAdmin', 'classAdmin'];

  // If user is logged in and tries to access login page, redirect to admin dashboard
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

 

  return response
}
