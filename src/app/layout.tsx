import {ThemeProvider} from '@/app/providers/theme-provider';
import Analytics from '@/config/analytics';
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
import './globals.css';
import {QueryProvider} from './providers/query-provider';

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
  title: `${APP_NAME} | Join the Conversation`,
  description: `Be part of the discussions that matter. Share your thoughts, and explore trending topics on ${APP_NAME}.`,
  icons: {
    icon: [
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
      {url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png'},
      {url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png'},
    ],
    apple: '/apple-touch-icon.png',
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
        <head>
          <Analytics />
        </head>
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
