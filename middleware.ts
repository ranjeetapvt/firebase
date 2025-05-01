import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const isAuthPage = req.nextUrl.pathname === '/signin';
  const isPublicPage =
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname === '/privacy' ||
    req.nextUrl.pathname === '/terms';

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};