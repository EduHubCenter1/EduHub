import { type NextRequest } from 'next/server';
import { handleAuth } from './lib/middlewares/authMiddleware'
import { handleadminAuth } from './lib/middlewares/adminMiddleware'
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the route concerns authentication or protected API routes, apply the auth middleware
  if (pathname.startsWith('/login') ) {
      return handleAuth(request)
  }
  if (pathname.startsWith('/admin') ) {
      return handleadminAuth(request)
  }

  // For all other routes, do nothing
  return;
}

