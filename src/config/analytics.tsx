'use client';

import {usePathname} from 'next/navigation';
import Script from 'next/script';

export default function Analytics() {
  const pathname = usePathname();

  // Exclude in dev
  if (process.env.NODE_ENV !== 'production') return null;

  //  Exclude analytics on /admin routes
  if (pathname.startsWith('/admin')) return null;

  //   useEffect(() => {
  //     // Trigger GA page view on every route + query change
  //     if (typeof window.gtag === "function") {
  //       window.gtag("config", 'G-86PY80CB4F', {
  //         page_path: pathname + (searchParams?.toString() ? `?${searchParams}` : ""),
  //       });
  //     }
  //   }, [pathname, searchParams]);

  return (
    <>
      {/* Google tag (gtag.js)  */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-86PY80CB4F"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`

         window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-86PY80CB4F', {
            page_path: window.location.pathname,
          });
     `}
      </Script>
    </>
  );
}
