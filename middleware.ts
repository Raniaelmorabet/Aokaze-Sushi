import { NextRequest, NextResponse } from 'next/server';

// This middleware runs before any pages are rendered
export function middleware(request: NextRequest) {
  // Add a header to tell Next.js to render the page dynamically
  const response = NextResponse.next();
  
  // Add headers to force dynamic rendering
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('x-middleware-revalidate', '0');
  
  return response;
}

// Run the middleware on all routes, especially profile
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
}; 