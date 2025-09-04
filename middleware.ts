import { type NextRequest } from 'next/server';
import { handleAuth } from './lib/middlewares/authMiddleware'
import { handleadminAuth } from './lib/middlewares/adminMiddleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  // If the host is the dashboard subdomain, apply admin auth logic
  if (host === 'dashboard.eduhubcenter.online') {
    return handleadminAuth(request);
  }

  // Original middleware logic for paths
  if (pathname.startsWith('/login')) {
    return handleAuth(request)
  }
  if (pathname.startsWith('/dashboard')) {
    return handleadminAuth(request);
  }

  // No middleware action for other paths
  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}