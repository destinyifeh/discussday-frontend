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
  title: `${APP_NAME} | Join the Conversation`,
  description: `Be part of the discussions that matter. Share your thoughts, and explore trending topics on ${APP_NAME}.`,
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({children}: LayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
