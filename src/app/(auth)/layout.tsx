import {AuthLayout} from '@/components/layouts/auth';
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
  title: `${APP_NAME} | Account Access`,
  description: `Access your ${APP_NAME} account or create a new one to join our community. Secure login and easy signup.`,
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({children}: LayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
