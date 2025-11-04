'use client';

import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import moment from 'moment';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export const AppFooter = () => {
  const location = usePathname();
  const {currentUser} = useAuthStore(state => state);
  //  const isActive = (path: string) => location === path;

  // Helper: pick correct path based on login state
  const getPublicOrPrivatePath = (authPath: string, guestPath: string) =>
    currentUser ? authPath : guestPath;

  // Active link helper
  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);

  const footerLinks = [
    {
      label: 'About',
      path: getPublicOrPrivatePath('/about-us', '/about'),
    },
    {
      label: 'Help Center',
      path: getPublicOrPrivatePath('/help', '/help-center'),
    },
    {
      label: 'Terms of Service',
      path: getPublicOrPrivatePath('/terms', '/terms-of-service'),
    },
    {
      label: 'Privacy Policy',
      path: getPublicOrPrivatePath('/privacy', '/privacy-policy'),
    },
    {
      label: 'Advertise',
      path: getPublicOrPrivatePath('/advertise', '/ads-info'),
    },
  ];

  return (
    <footer className="py-8 px-4 text-center border-t border-app-border">
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-4">
        {footerLinks.map(link => (
          <Link
            key={link.path}
            href={link.path}
            className={cn(
              'hover:underline text-sm transition-colors duration-150',
              isActive(link.path)
                ? 'font-semibold text-app'
                : 'font-normal text-app-gray',
            )}>
            {link.label}
          </Link>
        ))}

        {/* <Link
          href={currentUser ? '/about' : '/about-us'}
          className={cn(
            'hover:underline text-sm',
            isActive('/about') ? 'font-bold' : 'font-normal',
          )}>
          About
        </Link>
        <Link
          href={currentUser ? '/help' : '/help-center'}
          className={cn(
            'hover:underline text-sm',
            isActive('/help-center') ? 'font-bold' : 'font-normal',
          )}>
          Help Center
        </Link>
        <Link
          href={currentUser ? '/terms' : '/terms-of-service'}
          className={cn(
            'hover:underline text-sm',
            isActive('/terms-of-service') ? 'font-bold' : 'font-normal',
          )}>
          Terms of Service
        </Link>
        <Link
          href={currentUser ? '/privacy' : '/privacy-policy'}
          className={cn(
            'hover:underline text-sm',
            isActive('/privacy-policy') ? 'font-bold' : 'font-normal',
          )}>
          Privacy Policy
        </Link>

        <Link
          href={currentUser ? '/advertise' : '/ads-info'}
          className={cn(
            'hover:underline text-sm',
            isActive('/ads-info') ? 'font-bold' : 'font-normal',
          )}>
          Advertise
        </Link> */}
      </div>
      <p className="text-sm text-app-gray">
        © {moment().format('YYYY')} Discussday. All rights reserved.
      </p>
    </footer>
  );
};

export const DashboardFooter = () => {
  const location = usePathname();
  const {currentUser} = useAuthStore(state => state);
  //  const isActive = (path: string) => location === path;

  // Helper: pick correct path based on login state
  const getPublicOrPrivatePath = (authPath: string, guestPath: string) =>
    currentUser ? authPath : authPath;

  // Active link helper
  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);

  const footerLinks = [
    {
      label: 'About',
      path: getPublicOrPrivatePath('/about-us', '/about'),
    },
    {
      label: 'Help Center',
      path: getPublicOrPrivatePath('/help', '/help-center'),
    },
    {
      label: 'Terms of Service',
      path: getPublicOrPrivatePath('/terms', '/terms-of-service'),
    },
    {
      label: 'Privacy Policy',
      path: getPublicOrPrivatePath('/privacy', '/privacy-policy'),
    },
    {
      label: 'Advertise',
      path: getPublicOrPrivatePath('/advertise', '/ads-info'),
    },
  ];

  return (
    <footer className="py-8 px-4 text-center border-t border-app-border">
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-4">
        {footerLinks.map(link => (
          <Link
            key={link.path}
            href={link.path}
            className={cn(
              'hover:underline text-sm transition-colors duration-150',
              isActive(link.path)
                ? 'font-semibold text-app'
                : 'font-normal text-app-gray',
            )}>
            {link.label}
          </Link>
        ))}

        {/* <Link
          href={currentUser ? '/about' : '/about-us'}
          className={cn(
            'hover:underline text-sm',
            isActive('/about') ? 'font-bold' : 'font-normal',
          )}>
          About
        </Link>
        <Link
          href={currentUser ? '/help' : '/help-center'}
          className={cn(
            'hover:underline text-sm',
            isActive('/help-center') ? 'font-bold' : 'font-normal',
          )}>
          Help Center
        </Link>
        <Link
          href={currentUser ? '/terms' : '/terms-of-service'}
          className={cn(
            'hover:underline text-sm',
            isActive('/terms-of-service') ? 'font-bold' : 'font-normal',
          )}>
          Terms of Service
        </Link>
        <Link
          href={currentUser ? '/privacy' : '/privacy-policy'}
          className={cn(
            'hover:underline text-sm',
            isActive('/privacy-policy') ? 'font-bold' : 'font-normal',
          )}>
          Privacy Policy
        </Link>

        <Link
          href={currentUser ? '/advertise' : '/ads-info'}
          className={cn(
            'hover:underline text-sm',
            isActive('/ads-info') ? 'font-bold' : 'font-normal',
          )}>
          Advertise
        </Link> */}
      </div>
      <p className="text-sm text-app-gray">
        © {moment().format('YYYY')} Discussday. All rights reserved.
      </p>
    </footer>
  );
};
