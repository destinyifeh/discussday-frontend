'use client';
import {AppFooter, DashboardFooter} from '@/components/app-footer';
import {CustomLogo} from '@/components/app-logo';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {HTTP_STATUS_CODE} from '@/constants/api-resources';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import {authService} from '@/services/auth-service';
import {notificationService} from '@/services/notification-service';
import {Role} from '@/types/user.types';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {useQuery} from '@tanstack/react-query';
import {
  BarChart2,
  Bell,
  BookmarkIcon,
  Home,
  LogOut,
  Search,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {toast} from 'sonner';
import SearchBarList from '../../forms/list-search-bar';

interface MainLayoutProps {
  children?: React.ReactNode;
  showLogo?: boolean;
  showSearch?: boolean;
  searchTerm?: string;
  setSearchTerm?: (search: string) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
  title?: string;
}

const MobileNavigation: React.FC<MainLayoutProps> = ({
  children,
  showLogo = true,
  showSearch = false,
  searchRef,
  searchTerm,
  setSearchTerm,
  title,
}) => {
  const router = useRouter();
  const location = usePathname();
  const {logout, currentUser} = useAuthStore(state => state);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const shouldQuery = !!currentUser;
  const {error, data: unreadCount} = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () =>
      notificationService.getUnreadNotificationsCounntRequestAction(),
    retry: 1,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    enabled: shouldQuery,
  });

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    if (!currentUser) {
      return router.push('/login');
    }
    try {
      const res = await authService.logoutRequestAction();
      if (res?.data?.code === HTTP_STATUS_CODE.OK) {
        logout();
        toast.success('Successfully logged out.');

        router.push('/login');
      } else {
        toast.error(
          'Something went wrong while logging you out. Please try again.',
        );
      }
    } catch (err) {
      toast.error(
        'Something went wrong while logging you out. Please try again.',
      );
    }
  };

  const navItems = [
    {icon: <Home size={24} />, label: 'Home', path: '/'},
    {icon: <Search size={24} />, label: 'Explore', path: '/explore'},
    ...(currentUser
      ? [
          {
            icon: <Bell size={24} />,
            label: 'Notifications',
            path: '/notifications',
          },

          {
            icon: <BookmarkIcon size={24} />,
            label: 'Bookmarks',
            path: '/bookmarks',
          },

          {
            icon: <User size={24} />,
            label: 'Profile',
            path: `/profile`,
          },

          {
            label: 'Settings',
            icon: <Settings size={24} />,
            path: '/settings',
          },
          {
            label: 'My Ads',
            icon: <BarChart2 size={24} />,
            path: '/advertise/ad-performance',
          },
        ]
      : []),

    ...(currentUser?.role === Role.SUPER_ADMIN ||
    currentUser?.role === Role.ADMIN
      ? [
          {
            label: 'Admin',
            icon: <User size={24} />,
            path: `/admin/${currentUser._id}`,
          },
        ]
      : []),
  ];

  if (title) {
    return (
      <div className="lg:hidden">
        <div className="border-b flex justify-between items-center h-16 px-3 z-30 border-app-border">
          <div className="flex gap-5 items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.avatar ?? undefined} />
                    <AvatarFallback className="capitalize text-app text-2xl">
                      {currentUser?.username.charAt(0) ?? 'G'}
                    </AvatarFallback>
                  </Avatar>
                  {/* <Menu size={24} /> */}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <VisuallyHidden>
                  <SheetTitle>Mobile Sidebar</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col h-full overflow-y-auto">
                  <div className="p-4 flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={currentUser?.avatar ?? undefined} />
                      <AvatarFallback className="capitalize text-app text-3xl">
                        {currentUser?.username.charAt(0) ?? 'G'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold capitalize">
                        {currentUser?.username ?? 'Guest'}
                      </p>
                      {/* <p className="text-app-gray">@{currentUser?.username}</p> */}
                    </div>
                  </div>

                  <nav className="flex-1 space-y-1 p-2">
                    {navItems.map((item, index) => (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.path}
                          className={cn(
                            'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition active:scale-90 transition-transform duration-150',
                            isActive(item.path) ? 'font-bold' : 'font-normal',
                          )}>
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="p-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start active:scale-90 transition-transform duration-150"
                      onClick={handleLogout}>
                      <LogOut size={18} className="mr-2" />
                      {currentUser ? '  Log out' : 'Log In'}
                    </Button>
                  </div>
                  <div className="mt-auto p-4 shrink-0">
                    <AppFooter />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          {currentUser ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/notifications')}
              className="relative active:scale-90 transition-transform duration-150">
              <Bell size={24} />

              {unreadCount && unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className={cn(
                    'absolute -top-1 -right-1 h-5 flex items-center justify-center p-0 text-xs font-bold rounded-full',
                    unreadCount > 99 ? 'w-7' : 'w-5',
                  )}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-app">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      // className={clsx('min-h-screen flex lg:hidden', {
      className="lg:hidden">
      <div className="border-b flex justify-between items-center h-16 px-3 z-30 border-app-border">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar ?? undefined} />
                <AvatarFallback className="capitalize text-app text-2xl">
                  {currentUser?.username.charAt(0) ?? 'G'}
                </AvatarFallback>
              </Avatar>
              {/* <Menu size={24} /> */}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <VisuallyHidden>
              <SheetTitle>Mobile Sidebar</SheetTitle>
            </VisuallyHidden>
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="p-4 flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={currentUser?.avatar ?? undefined} />
                  <AvatarFallback className="capitalize text-app text-3xl">
                    {currentUser?.username.charAt(0) ?? 'G'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold capitalize">
                    {currentUser?.username ?? 'Guest'}
                  </p>
                  {/* <p className="text-app-gray">@{currentUser?.username}</p> */}
                </div>
              </div>

              <nav className="flex-1 space-y-1 p-2">
                {navItems.map((item, index) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition active:scale-90 transition-transform duration-150',
                        isActive(item.path) ? 'font-bold' : 'font-normal',
                      )}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full justify-start active:scale-90 transition-transform duration-150"
                  onClick={handleLogout}>
                  <LogOut size={18} className="mr-2" />
                  {currentUser ? '  Log out' : 'Log In'}
                </Button>
              </div>
              <div className="mt-auto p-4 shrink-0">
                <DashboardFooter />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {showLogo && (
          // <h1 className="text-xl font-bold">{title}</h1>

          <Link href="/">
            <CustomLogo logo="/logo_blue.webp" height={100} width={125} />
          </Link>
        )}
        {showSearch && (
          <SearchBarList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            ref={searchRef}
          />
        )}
        {currentUser ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/notifications')}
            className="relative active:scale-90 transition-transform duration-150">
            <Bell size={24} />

            {unreadCount && unreadCount > 0 && (
              <Badge
                variant="destructive"
                className={cn(
                  'absolute -top-1 -right-1 h-5 flex items-center justify-center p-0 text-xs font-bold rounded-full',
                  unreadCount > 99 ? 'w-7' : 'w-5',
                )}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="ghost" className="text-app">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
