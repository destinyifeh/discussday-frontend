// middleware.ts
import {decodeJwt} from 'jose';
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

  // decode JWT if token exists
  let isTokenExpired = true;

  if (token) {
    try {
      const decoded = decodeJwt(token);
      console.log(decoded, 'decoded token');
      const now = Math.floor(Date.now() / 1000);
      console.log(now, 'decoded time');
      isTokenExpired = decoded.exp ? decoded.exp < now : true;
      console.log(isTokenExpired, 'decoded tokenExpired?');
    } catch (err) {
      isTokenExpired = true;
    }
  }
  // ──────────────── LOGGED‑IN user ────────────────
  if (token && !isTokenExpired && guestRoute) {
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

  // ──────────────── EXPIRED token ────────────────
  if (isTokenExpired && !guestRoute) {
    const url = new URL('/login', req.url);
    url.searchParams.set('reason', 'sessionExpired');
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // all good
}

export const config = {
  matcher: '/((?!_next|.*\\..*).*)', // run on every route except static files
};
