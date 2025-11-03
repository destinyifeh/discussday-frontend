'use client';
import {usePathname} from 'next/navigation';
import React from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({children}: MainLayoutProps) => {
  const location = usePathname();

  const isSection2 =
    location.includes('/discuss/') ||
    (location.includes('/post/') && !location.includes('/reply')) ||
    location.includes('/user/') ||
    location.includes('/create-post') ||
    location.includes('/bookmarks') ||
    location.includes('/profile/');

  return (
    <main className="flex-1 flex flex-col max-w-xl border-x border-app-border">
      <div className="pt-0 md:pt-0">{children}</div>
    </main>
  );
};
