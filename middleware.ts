import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware ensures all pages are treated as dynamic routes
export function middleware(request: NextRequest) {
  // Add a header to force the page to be dynamically rendered
  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('Cache-Control', 'no-store, must-revalidate');
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}; 