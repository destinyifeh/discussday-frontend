import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {Metadata} from 'next';
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

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: `${APP_NAME} | Join the Conversation`,
  description: `Be part of the discussions that matter. Share your thoughts, and explore trending topics on ${APP_NAME}.`,
};

export default function Layout({children}: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
