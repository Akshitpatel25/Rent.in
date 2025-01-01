import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/auth"
 

export async function middleware(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  const path = request.nextUrl.pathname //by this we are accessing the current path

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

  const token = request.cookies.get('Rtoken')?.value || session?.user

  console.log(token);
  

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