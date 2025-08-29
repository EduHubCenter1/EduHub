import { type NextRequest } from 'next/server';
import { handleAuth } from './lib/middlewares/authMiddleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the route concerns authentication or protected API routes, apply the auth middleware
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload')) {
      return handleAuth(request)
  }

  // For all other routes, do nothing
  return;
}

// The "matcher" defines on which routes the middleware should execute
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload/:path*'],
};