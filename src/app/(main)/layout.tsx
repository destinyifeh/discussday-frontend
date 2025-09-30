import {PublicLayout} from '@/components/layouts/public';
import {APP_NAME} from '@/constants/settings';
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Discover & Discuss`,
  description: `Stay updated with the latest posts, trends, and conversations on ${APP_NAME}. Engage with topics that matter to you.`,
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({children}: LayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
