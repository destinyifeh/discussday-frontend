import {Sections} from '@/constants/data';

export const GUEST_ONLY = [
  '/about-us',
  '/advertise',
  '/contact-support',
  '/help-center',
  '/terms-of-service',
  '/privacy-policy',
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
  const parts = pathname.split('/').filter(Boolean);

  // Public discussion pages
  if (parts[0] === 'discuss' && parts.length >= 2) return true;

  // Make /home public
  if (pathname === '/home') return true;

  if (pathname === '/') return true;

  if (parts[0] === 'user') return true;

  if (pathname === '/explore') return true;

  if (pathname === '/community-guidelines') return true;

  return false;
}

export function isPublicPath(pathname: string) {
  console.log(pathname, 'opaythh');
  const parts = pathname.split('/').filter(Boolean);

  const publicRoutes = [
    '/',
    '/home',
    '/explore',
    '/community-guidelines',
    '/discuss',
    '/bookmarks',
    '/profile',
  ];

  // Direct match for simple routes
  if (publicRoutes.includes(pathname)) return true;

  // Get all section slugs
  const sectionSlugs = Sections.map(section => section.slug);

  // Check for section pages: /{section}
  if (sectionSlugs.includes(parts[0])) return true;

  // Check for post details: /{section}/{slugId}/{slug}
  if (sectionSlugs.includes(parts[0]) && parts.length >= 3) return true;

  // Dynamic/public paths
  if (parts[0] === 'discuss' && parts.length >= 2) return true;
  if (parts[0] === 'user') return true;

  return false;
}
