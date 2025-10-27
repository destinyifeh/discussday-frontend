'use client';

import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {CustomLogo} from './app-logo';
import {Button} from './ui/button';

export const PageHeader = ({
  title,
  description,
  href,
  showBackIcon = true,
}: {
  title: string | undefined;
  description?: string | number;
  href?: string;
  showBackIcon?: boolean;
}) => {
  const navigate = useRouter();

  return (
    <div className="sticky top-0 bg-white/80 dark:bg-background backdrop-blur-sm z-10 border-b md:mt-0 lg:mt-0 border-app-border">
      <div className="px-4 py-3 flex items-center gap-6">
        {showBackIcon && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (href) {
                navigate.push(href);
              } else {
                navigate.back();
              }
            }}>
            <ChevronLeft />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-bold capitalize">{title}</h1>
          {description && <p className="text-sm">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const navigate = useRouter();

  return (
    <div className="sticky top-0 bg-white/80 border-app-border dark:bg-background backdrop-blur-sm z-10 border-b">
      <div className="px-4 py-3 flex flex-col">
        <div className="flex items-start gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate.back()}
            className="mt-1">
            <ChevronLeft />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">{title}</h1>
            {description && <p className="text-sm">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppHeader = () => {
  return (
    <header className="border-b border-app-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between h-9">
          {/* <Link href="/" className="text-2xl font-bold text-app">
            Discussday
          </Link> */}
          <Link href="/">
            <CustomLogo logo="/logo_blue.webp" width={150} height={10} />
          </Link>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-app hover:bg-app/90 dark:bg-app/90 dark:hover:bg-app text-white">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export const CustomPageHeader = ({
  title,
  description,
  href,
}: {
  title: string | undefined;
  description?: string | number;
  href?: string;
}) => {
  const navigate = useRouter();

  return (
    <div className="bg-white/80 dark:bg-background backdrop-blur-sm z-10 border-b md:mt-0 lg:mt-0 border-app-border">
      <div className="px-4 py-3 flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (href ? navigate.push(href) : navigate.back())}>
          <ChevronLeft />
        </Button>
        <div>
          <h1 className="text-xl font-bold capitalize">{title}</h1>
          {description && (
            <p className="text-sm text-app-gray">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
