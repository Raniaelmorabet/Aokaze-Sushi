import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before any pages are rendered
export function middleware(request: NextRequest) {
  // Create a response object
  const response = NextResponse.next();
  
  // Add headers to prevent caching and force dynamic rendering
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  
  return response;
}

// Limit the middleware to specific paths to avoid issues
export const config = {
  matcher: ['/profile/:path*', '/reservation/:path*'],
}; 