'use client';

import {CustomLogo} from '@/components/app-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {toast} from '@/components/ui/toast';
import {HTTP_STATUS_CODE} from '@/constants/api-resources';
import {resourceItems, Sections} from '@/constants/data';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import {logoutRequestAction} from '@/modules/auth/actions';
import {getUnreadNotificationsCounntRequestAction} from '@/modules/dashboard/notifications/actions';
import {Role} from '@/types/user.types';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  BarChart2,
  Bell,
  BookmarkIcon,
  Home,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import {useTheme} from 'next-themes';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '../../ui/avatar';
import {Button} from '../../ui/button';
type NavItemProps = {
  icon: any;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
};

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start py-6 px-4 text-base rounded-xl transition-colors',
        active
          ? 'bg-app-hover text-app font-semibold'
          : 'text-app-gray font-normal',
      )}
      onClick={onClick}>
      <div className="flex items-center w-full">
        <Icon className="mr-4" size={1} />
        <span className="text-lg">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-auto bg-app text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
    </Button>
  );
};

export const SidebarLayoutLeft = () => {
  const navigate = useRouter();
  const {theme, setTheme} = useTheme();
  const location = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isActive = (path: string) => location === path;
  const {mutate: logoutRequest} = useMutation({
    mutationFn: logoutRequestAction,
  });
  const {logout, currentUser} = useAuthStore(state => state);
  const [mounted, setMounted] = useState(false);

  const {error, data: unreadCount} = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => getUnreadNotificationsCounntRequestAction(),
    retry: 1,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch

  const secondaryNavItems = [
    // {
    //   label: 'Profile',
    //   icon: <User size={24} className="mr-4" />,
    //   path: `/profile/${'des'}`,
    // },
    {
      label: 'Ad View',
      icon: <BarChart2 size={24} className="mr-4" />,
      path: '/advertise/ad-performance',
    },

    ...(currentUser?.role === Role.SUPER_ADMIN ||
    currentUser?.role === Role.ADMIN
      ? [
          {
            label: 'Admin',
            icon: <User size={24} className="mr-4" />,
            path: '/admin',
          },
        ]
      : []),
    {
      label: 'Settings',
      icon: <Settings size={24} className="mr-4" />,
      path: '/settings',
    },
  ];

  const navItems = [
    {icon: <Home size={24} className="mr-4" />, label: 'Home', path: '/home'},
    {
      icon: <Search size={24} className="mr-4" />,
      label: 'Explore',
      path: '/explore',
    },
    {
      icon: <Bell size={24} className="mr-4" />,
      label: 'Notifications',
      path: '/notifications',
      badge: unreadCount,
    },
    // {
    //   icon: <Mail size={24} className="mr-4" />,
    //   label: 'Messages',
    //   path: '/messages',
    // },
    {
      icon: <BookmarkIcon size={24} className="mr-4" />,
      label: 'Bookmarks',
      path: '/bookmarks',
    },
    {
      icon: <User size={24} className="mr-4" />,
      label: 'Profile',
      path: `/profile/${currentUser?.username}`,
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await logoutRequestAction();
      if (res?.data?.code === HTTP_STATUS_CODE.OK) {
        logout();
        toast.success('Successfully logged out.');

        navigate.push('/login');
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

  const onToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r p-4 border-app-border">
      <div className="flex-1 space-y-4">
        {/* <div className="mb-6">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </div> */}
        <div className="p-2 flex items-center justify-between">
          {/* <h1 className="text-xl font-bold">Discussday</h1> */}
          <Link href="/home">
            <CustomLogo logo="/logo_black.png" />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="hover:bg-app-hover active:scale-90 transition-transform duration-150">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <nav className="space-y-2">
          {/* {mainNavItems.map(item => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location === item.path}
              onClick={() => navigate.push(item.path)}
              badge={item.badge}
            />
          ))} */}

          {navItems.map((item, index) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition dark:hover:bg-app-dark-bg/10 active:scale-90 transition-transform duration-150',
                isActive(item.path) ? 'font-bold' : 'font-normal',
              )}>
              <div className="flex items-center w-full">
                {item.icon}
                <span className="text-lg">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-app text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t space-y-2 border-app-border dark:border-app-dark-border">
          {secondaryNavItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition dark:hover:bg-app-dark-bg/10 active:scale-90 transition-transform duration-150',
                isActive(item.path) ? 'font-bold' : 'font-normal',
              )}>
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* <div className="mt-auto">
          <Button
            className="w-full rounded-full py-6 bg-app hover:bg-app/90"
            onClick={() => navigate.push('/create-post')}>
            <PlusCircle className="mr-2" size={18} />
            New Post
          </Button>
        </div> */}
        <div className="mb-10">
          <Button
            className="text-white rounded-full py-6 w-full mt-4 hover:bg-app/90 bg-app darK:hover:bg-app bg-app/90 active:scale-90 transition-transform duration-150"
            onClick={() => navigate.push('/discuss')}>
            Start Discussion
          </Button>
        </div>

        <div className="mt-auto space-y-4">
          {/* <div className="flex items-center gap-2 p-4 rounded-full hover:bg-app-hover cursor-pointer">
            <Avatar>
              <AvatarImage
                src={'https://api.dicebear.com/7.x/avataaars/svg?seed=mercy'}
              />
              <AvatarFallback>{'D'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="font-bold truncate">{'Desz Boss'}</p>
              <p className="text-app-gray truncate">{'Logout'}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={e => {
                e.stopPropagation();
                handleLogout();
              }}>
              <LogOut size={18} />
            </Button>
          </div> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer p-2 rounded-full">
                <Avatar>
                  <AvatarImage src={currentUser?.avatar ?? undefined} />
                  <AvatarFallback className="capitalize text-app text-3xl">
                    {currentUser?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium capitalize">
                    {currentUser?.username}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/${currentUser?.username?.toLowerCase()}`}
                  className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span className="">Profile</span>
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild className="">
                <Link href="/profile/edit">
                  <span className="">Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <span className="">Settings</span>
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};

export const SidebarLayoutRight = () => {
  const [mounted, setMounted] = useState(false);
  const location = usePathname();
  const isActive = (path: string) => location === path;
  useEffect(() => {
    setMounted(true);
  }, []);

  const showWhoTOFollow = false;

  if (!mounted) return null;
  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen border-0 p-4 border-app-border ">
      <div className="sticky top-4 space-y-4">
        <div className="rounded-lg p-4 bg-app-hover dark:bg-background border border-app-border">
          <h2 className="font-bold text-xl mb-4">Discuss</h2>

          <div className="flex flex-row flex-wrap items-center">
            {Sections.map(section => (
              <Link
                key={section.id}
                href={`/discuss/${section.name.toLowerCase()}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-white dark:hover:bg-app-dark-bg/10 active:scale-90 transition-transform duration-150">
                <span className="text-app font-semibold">{section.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Who to follow  */}
        {showWhoTOFollow && (
          <div className="rounded-lg p-4 bg-app-hover dark:bg-background border border-app-border">
            <h2 className="font-bold text-xl mb-4">Who to follow</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">Alex Johnson</p>
                    <p className="text-app-gray">God is goood</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-full text-white bg-app hover:bg-app/90">
                  Follow
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Other resources  */}
        <div className="rounded-lg p-4 bg-app-hover dark:bg-background border border-app-border">
          <h2 className="font-bold text-xl mb-4">Resources</h2>
          <div className="flex flex-row flex-wrap items-center">
            {resourceItems.map(resource => (
              <Link
                key={resource.label}
                href={`${resource.path}`}
                className={cn(
                  'flex items-center justify-between p-2 hover:bg-white rounded-md dark:hover:bg-app-dark-bg/10 active:scale-90 transition-transform duration-150',
                  isActive(resource.path)
                    ? 'font-bold bg-white dark:bg-app-dark-bg/10'
                    : 'font-normal',
                )}>
                <span className="text-app font-semibold">{resource.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
