'use client';

import {cn} from '@/lib/utils';
import moment from 'moment';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export const AppFooter = () => {
  const location = usePathname();
  const isActive = (path: string) => location === path;
  return (
    <footer className="py-8 px-4 text-center text-app-gray border-t border-app-border">
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-4">
        <Link
          href="/about"
          className={cn(
            'hover:underline text-sm text-foreground',
            isActive('/about') ? 'font-bold' : 'font-normal',
          )}>
          About
        </Link>
        <Link
          href="/help-center"
          className={cn(
            'hover:underline text-sm text-foreground',
            isActive('/help-center') ? 'font-bold' : 'font-normal',
          )}>
          Help Center
        </Link>
        <Link
          href="/terms-of-service"
          className={cn(
            'hover:underline text-sm text-foreground',
            isActive('/terms-of-service') ? 'font-bold' : 'font-normal',
          )}>
          Terms of Service
        </Link>
        <Link
          href="/privacy-policy"
          className={cn(
            'hover:underline text-sm text-foreground',
            isActive('/privacy-policy') ? 'font-bold' : 'font-normal',
          )}>
          Privacy Policy
        </Link>

        <Link
          href="/ads-info"
          className={cn(
            'hover:underline text-sm text-foreground',
            isActive('/ads-info') ? 'font-bold' : 'font-normal',
          )}>
          Advertise
        </Link>
      </div>
      <p className="text-sm text-foreground">
        © {moment().format('YYYY')} Discussday. All rights reserved.
      </p>
    </footer>
  );
};
