import Analytics from '@/config/analytics';
import {ThemeProvider} from '@/config/providers/theme-provider';
import {structuredData} from '@/config/structuredData';
import {APP_NAME} from '@/constants/settings';
import {Metadata} from 'next';
import {
  DM_Sans,
  Geist,
  Geist_Mono,
  Inter,
  Lato,
  Nunito,
  Oswald,
  Poppins,
  Roboto,
} from 'next/font/google';
import Script from 'next/script';
import {QueryProvider} from '../config/providers/query-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
});

const interFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const robotoFont = Roboto({
  //weight: '400',
  subsets: ['latin'],
});

const nunitoFont = Nunito({
  //weight: '400',
  variable: '--font-nunito',
  subsets: ['latin'],
});

const latoFont = Lato({
  weight: '400',
  subsets: ['latin'],
});

const oswaldFont = Oswald({
  weight: '400',
  variable: '--font-oswald',
  subsets: ['latin'],
  display: 'swap',
});

const poppinsFont = Poppins({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://discussday.com'),
  title: {
    default: `${APP_NAME} | Join the Conversation`,
    template: '%s | Discussday',
  },
  description: `Be part of the discussions that matter. Share your thoughts, and explore trending topics on ${APP_NAME}.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com',
    title: 'Discussday - Join the Conversation',
    description:
      'Join Discussday to share ideas, have conversations, and explore trending topics.',
    siteName: 'Discussday',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discussday',
    description:
      'Meaningful conversations, share your thoughts, and explore trending topics.',
    creator: '@Discussday',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
      </head>
      <body className={`${interFont.className}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
