import { type NextRequest } from 'next/server';
import { handleAuth } from './lib/middlewares/authMiddleware'
import { handleadminAuth } from './lib/middlewares/adminMiddleware'
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the route concerns authentication or protected API routes, apply the auth middleware
  if (pathname.startsWith('/login') ) {
      return handleAuth(request)
  }
  if (pathname.startsWith('/dashboard')) {
    return handleadminAuth(request);
  }

  return;
}

  export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*', // ✅ toutes les pages admin
  ],
}

