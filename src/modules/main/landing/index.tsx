'use client';

import {AppFooter} from '@/components/app-footer';
import {CustomLogo} from '@/components/app-logo';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export const LandingPage = () => {
  const navigate = useRouter();

  return (
    <div className="flex flex-col min-h-dvh">
      {/* <div className="flex-1 flex flex-col items-center justify-center p-8"> */}
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="hidden md:flex flex-1 flex items-center justify-center p-6 bg-app/90 dark:bg-app">
          <div className="max-w-md">
            {/* <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-32 h-32 text-white mb-8">
                <g>
                  <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </g>
              </svg> */}
            <h1 className="text-4xl text-white text-center md:text-4xl font-bold mb-8">
              Discussday Forum
            </h1>

            <div className="hidden md:block text-white">
              <h1 className="text-3xl font-bold mb-6">Join our community</h1>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 p-1 rounded-full">✓</span>
                  <span>Create and share posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 p-1 rounded-full">✓</span>
                  <span>Connect with other users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 p-1 rounded-full">✓</span>
                  <span>Join topic-specific discussions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex-1 p-8 flex flex-col justify-center items-center md:items-start"
          //className="text-center"
        >
          {/* <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-12 h-12 text-app mb-8">
            <g>
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </g>
          </svg> */}

          {/* <h1 className="text-3xl text-app text-center font-bold mb-8 md:hidden">
            Discussday
          </h1> */}

          <Link href="/" className="mb-8 md:hidden">
            <CustomLogo logo="/logo_blue.png" width={200} height={200} />
          </Link>

          {/* <h1 className="text-center text-5xl md:text-6xl font-bold mb-12">
            Happening now
          </h1> */}

          <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">
            Join the conversation today.
          </h2>

          <div className="space-y-4 w-full max-w-xs">
            <Button
              className="w-full bg-app hover:bg-app/90 rounded-full py-6 text-lg text-white"
              onClick={() => navigate.push('/register')}>
              Create account
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-app-border"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-app-gray">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-full py-6 text-lg border-2 border-app-border"
              onClick={() => navigate.push('/login')}>
              Sign in
            </Button>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
};
