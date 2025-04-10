import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  
  console.log('[Middleware] Token exists:', !!token);
  console.log('[Middleware] Path:', pathname);

  if (pathname.startsWith('/admin') || pathname.startsWith('/orders')) {
    if (!token) {
      console.log('[Middleware] No token - redirecting to /');
      return NextResponse.redirect(new URL('/', req.url));
    }

    try {
      const response = await fetch(`https://aokaze-sushi.vercel.app/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[Middleware] Response status:', response.status);
      
      if (!response.ok) {
        console.log('[Middleware] Auth failed - redirecting');
        throw new Error('Not authenticated');
      }

      const result = await response.json();
      const user = result.data; 

      // Admin route protection
      if (pathname.startsWith('/admin') && user.role !== "admin") {
        console.log('[Middleware] Non-admin trying to access admin area');
        return NextResponse.redirect(new URL('/', req.url));
      }

      // Orders route protection
      if (pathname.startsWith('/orders') && user.role !== 'customer') {
        console.log('[Middleware] Non-customer trying to access orders');
        return NextResponse.redirect(new URL('/', req.url));
      }

    } catch (error) {
      console.error('[Middleware] Error:', error.message);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*'],
};