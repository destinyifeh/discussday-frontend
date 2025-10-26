export const GUEST_ONLY = [
  '/', // landing
  '/about',
  '/help-center',
  '/terms-of-service',
  '/privacy-policy',
  '/ads-info',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/login/google/callback',
  '/set-username',
  '/verify-email',
  '/welcome',
];

/** Returns true if the current pathname matches any guest‑only route */
export const isGuestOnly = (pathname: string) =>
  GUEST_ONLY.some(p =>
    p === '/'
      ? pathname === '/' // exact root
      : pathname === p || pathname.startsWith(`${p}/`),
  );

export function isPublicPath2(pathname: string) {
  // detail pages: /discuss/{section}/{slugId}/{slug}
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'discuss' && parts.length >= 4) {
    return true;
  }

  return false;
}

export function isPublicPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);

  // Public discussion pages
  if (parts[0] === 'discuss' && parts.length >= 2) return true;

  // Make /home public
  if (pathname === '/home') return true;

  if (parts[0] === 'user') return true;

  if (pathname === '/explore') return true;

  if (pathname === '/community-guidelines') return true;

  return false;
}
