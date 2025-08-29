import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function handleAuth(request: NextRequest) {
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )
const { data: { user } } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // If user is logged in and tries to access login page, redirect to admin dashboard
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is not logged in and tries to access a protected route (that isn't the login page), redirect to login page
  if (!session && pathname.startsWith('/admin') && pathname !== '/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  
  // The /api/upload route is protected and needs a valid session
  if (!session && pathname.startsWith('/api/upload')) {
    return new NextResponse('Authentication required', { status: 401 });
  }

  // If user is logged in and tries to access an admin route, check their role
  if (session && pathname.startsWith('/admin') ) {
    

        const userRole = user?.role;

    // Define allowed admin roles (e.g., "superAdmin", "classAdmin")
    const allowedAdminRoles = ['superAdmin', 'classAdmin'];

    if (!userRole || !allowedAdminRoles.includes(userRole)) {
      // Redirect to a forbidden page or back to login with an error
      // For now, let's redirect to the login page with a message
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('error', 'unauthorized_role');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response
}
