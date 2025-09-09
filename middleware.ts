import { NextResponse, type NextRequest } from 'next/server';
import { handleAuth } from './lib/middlewares/authMiddleware'
import { handleadminAuth } from './lib/middlewares/adminMiddleware'
import { handleUpload } from './lib/middlewares/uploadMiddleware'

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
  if (pathname.startsWith('/upload')) {
    return handleUpload(request);
  }

  // --- New Visitor ID Logic (runs if auth passes) ---

  // 1. Get or generate visitorId
  let visitorId = request.cookies.get('eduhub_visitor_id')?.value;
  const newIdGenerated = !visitorId;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }

  // 2. Clone request headers and set the custom header for server-side access
  const headers = new Headers(request.headers);
  headers.set('x-visitor-id', visitorId);

  // 3. Create the response to pass through, rewriting with the new headers
  const response = NextResponse.next({
    request: {
      headers: headers,
    },
  });

  // 4. If we generated a new ID, set the cookie on the response
  if (newIdGenerated) {
    response.cookies.set({
      name: 'eduhub_visitor_id',
      value: visitorId,
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // One year
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This new matcher includes API routes so we can log events.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}