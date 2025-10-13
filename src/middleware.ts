// middleware.ts
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {ACCESS_TOKEN} from './constants/api-resources';
import {isGuestOnly, isPublicPath} from './lib/auth/paths';

export async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  const token = req.cookies.get(ACCESS_TOKEN as string)?.value;
  const guestRoute = isGuestOnly(pathname);

  console.log(
    'Cookies in middleware:',
    req.cookies.get('encrypted_access_token')?.value,
  );

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ──────────────── LOGGED‑IN user ────────────────
  if (token && guestRoute) {
    // Already authenticated ➜ redirect away from guest pages
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // ──────────────── LOGGED‑OUT user ────────────────
  if (!token && !guestRoute) {
    // no token at all → normal login redirect
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // all good
}

export const config = {
  matcher: '/((?!_next|.*\\..*).*)', // run on every route except static files
};
