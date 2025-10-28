'use client';
import {usePathname} from 'next/navigation';

import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import {BookmarkIcon, Home, PenSquare, Search, User} from 'lucide-react';
import Link from 'next/link';
export const MobileBottomTab = () => {
  const location = usePathname();
  const {currentUser} = useAuthStore(state => state);

  // Check if we're on a post details page
  const isPostDetail =
    location.includes('/post/') && !location.includes('/reply');

  const isActive = (path: string) => location === path;

  return (
    <div>
      {!isPostDetail && (
        // <div className="fixed bottom-0 left-0 right-0 border-t flex justify-around py-3 z-20 lg:hidden border-app-border">
        <div className="bg-background border-t border-app-border flex justify-around py-3 z-20 md:hidden">
          <Link
            href="/"
            className={cn(
              'p-2 cursor-pointer active:scale-90 transition-transform duration-150',
              isActive('/') && 'text-app',
            )}>
            <Home size={24} />
          </Link>
          <Link
            href="/explore"
            className={cn(
              'p-2 cursor-pointer active:scale-90 transition-transform duration-150',
              isActive('/explore') && 'text-app',
            )}>
            <Search size={24} />
          </Link>
          <Link
            href={'/discuss'}
            className={cn(
              'p-2 cursor-pointer active:scale-90 transition-transform duration-150',
              isActive('/discuss') && 'text-app',
            )}>
            <PenSquare size={24} />
          </Link>
          <Link
            href={'/bookmarks'}
            className={cn(
              'p-2 cursor-pointer active:scale-90 transition-transform duration-150',
              isActive('/bookmarks') && 'text-app',
            )}>
            <BookmarkIcon size={24} />
          </Link>
          <Link
            href={'/profile'}
            className={cn(
              'p-2 cursor-pointer active:scale-90 transition-transform duration-150',
              isActive(`/profile`) && 'text-app',
            )}>
            <User size={24} />
          </Link>
        </div>
      )}
    </div>
  );
};
