import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '../supabase/middleware'

export async function handleadminAuth(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createSupabaseMiddlewareClient(request, response)

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const userRole: string = user?.user_metadata?.role || '';
  const allowedAdminRoles = ['superAdmin', 'classAdmin']

  // Check if user is trying to access a protected admin route
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/admin')) {
    // If there is no user or the user's role is not in the allowed list
    if (!user || !allowedAdminRoles.includes(userRole)) {
      // Redirect to the homepage with an error
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('error', 'unauthorized')
      redirectUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}
