// middleware.ts
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {ACCESS_TOKEN, REFRESH_TOKEN} from './constants/api-resources';
import {isGuestOnly, isPublicPath} from './lib/auth/paths';

export async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  const token = req.cookies.get(ACCESS_TOKEN as string)?.value;
  const refresh = req.cookies.get(REFRESH_TOKEN as string)?.value;
  const guestRoute = isGuestOnly(pathname);

  console.log(
    'Cookies in middleware:',
    req.cookies.get('encrypted_access_token')?.value,
  );

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  //Allow refresh attempts if refresh token still exists
  if (!token && refresh) {
    return NextResponse.next();
  }

  // Logged-out completely
  if (!token && !refresh && !guestRoute) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Logged-in user visiting guest route
  if (token && guestRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next(); // all good
}

export const config = {
  matcher: '/((?!_next|.*\\..*).*)', // run on every route except static files
};
