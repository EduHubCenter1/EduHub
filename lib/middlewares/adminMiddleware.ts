import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '../supabase/middleware'

export async function handleadminAuth(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createSupabaseMiddlewareClient(request, response)

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  let userRole: string = '';
  if (session) {
    const roleApiUrl = new URL('/api/auth/role', request.url);
    const roleResponse = await fetch(roleApiUrl, {
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
      },
    });

    if (roleResponse.ok) {
      const { role } = await roleResponse.json();
      userRole = role || '';
    }
  }

  const allowedAdminRoles = ['superAdmin', 'classAdmin']

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/admin')) { // More specific API path
    if (!session || !allowedAdminRoles.includes(userRole)) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('error', 'unauthorized')
      redirectUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}
