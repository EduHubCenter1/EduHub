import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '../supabase/middleware'
import { prisma } from '@/lib/prisma' // Import Prisma client

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

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) { // Also apply to API routes
    if (!session || !allowedAdminRoles.includes(userRole)) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }

    // If classAdmin, fetch their AdminScope and attach it to the response headers
    if (userRole === 'classAdmin' && user?.id) {
      const adminScopes = await prisma.adminScope.findMany({
        where: { userId: user.id },
        include: {
          field: true,
          semester: true,
        },
      })
      // Attach adminScopes to a custom header.
      // Note: Headers have size limits, for large data, consider other methods.
      response.headers.set('X-Admin-Scopes', JSON.stringify(adminScopes));
    }
  }

  return response
}
