import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Allow access to the home page ("/") and sign-in page ("/api/auth/signin") without authentication
    if (!req.nextauth.token && pathname !== '/' && pathname !== '/api/auth/signin') {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    // Allow access if the user is authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Check if the user has a valid session
    },
  }
);

// Specify the routes that require authentication
export const config = {
  matcher: ['/dashboard'], // Match /dashboard and / routes
}
