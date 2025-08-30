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
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  const userRole: string = user?.user_metadata?.role || ''
  const allowedAdminRoles = ['superAdmin', 'classAdmin']

  if (pathname.startsWith('/dashboard')) {
    if (!session || !allowedAdminRoles.includes(userRole)) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}
