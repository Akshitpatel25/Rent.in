import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname //by this we are accessing the current path

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

  const token = request.cookies.get('Rtoken')?.value || request.cookies.get('next-auth.session-token')?.value
  

  if(isPublicPath && token) {
    // this is redirecting the user to main page of the app after login
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    // this is redirecting the user to login page
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
    
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/signup',
    '/login',
    '/verifyemail',
    '/logout',
    '/dashboard/:path*',
  ]
}