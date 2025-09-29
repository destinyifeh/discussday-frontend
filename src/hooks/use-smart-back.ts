'use client';
import {useRouter} from 'next/navigation';
import {useCallback} from 'react';

export function usegoBack(defaultRoute: string = '/home') {
  const router = useRouter();

  const goBack = useCallback(() => {
    let previousUrl = ''; // Initialize the variable safely

    try {
      // Check if we are in a browser environment
      if (typeof window !== 'undefined' && document.referrer) {
        previousUrl = document.referrer;

        // This log will NOW run because the code only reaches here
        // if the browser objects exist.
        console.log('Referrer URL (from browser):', previousUrl);

        const currentOrigin = window.location.origin;
        const isInternal = previousUrl.startsWith(currentOrigin);

        if (previousUrl === '' || !isInternal) {
          console.log(
            `External or direct access. Navigating to: ${defaultRoute}`,
          );
          router.push(defaultRoute);
        } else {
          console.log(`Internal navigation confirmed. Using router.back().`);
          router.back();
        }
      } else {
        // Fallback for non-browser or non-referrer situations (e.g., initial load, SSR)
        console.log(
          'Referrer not available or SSR context. Using router.back() as safe fallback.',
        );
        // router.back();
        window.location.href = '/home';
      }
    } catch (err) {
      // This catch block is now mostly for unexpected, non-SSR errors.
      console.error('Unexpected error in goBack hook:', err);
      //router.back();

      window.location.href = '/home';
    }
  }, [router, defaultRoute]);

  return goBack;
}
