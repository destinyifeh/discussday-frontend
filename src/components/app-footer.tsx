'use client';

import {cn} from '@/lib/utils';
import moment from 'moment';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export const AppFooter = () => {
  const location = usePathname();

  // Active link helper
  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);

  const footerLinks = [
    {
      label: 'About',
      path: '/about-us',
    },
    {
      label: 'Help Center',
      path: '/help-center',
    },
    {
      label: 'Terms of Service',
      path: '/terms-of-service',
    },
    {
      label: 'Privacy Policy',
      path: '/privacy-policy',
    },
    {
      label: 'Advertise',
      path: '/advertise',
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
      </div>
      <p className="text-sm text-app-gray">
        © {moment().format('YYYY')} Discussday. All rights reserved.
      </p>
    </footer>
  );
};
