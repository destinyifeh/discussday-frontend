import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {TermsOfServicePage} from '@/modules/dashboard/terms-of-service';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Terms of Service | ${APP_NAME}`,
  description: `Read the terms and conditions for using ${APP_NAME}. Learn about user rights, responsibilities, and policies.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/terms-of-service',
    title: `Terms of Service | ${APP_NAME}`,
    description: `Review the terms, conditions, user obligations, and policies governing the use of ${APP_NAME}. Stay informed about your rights and responsibilities.`,
    siteName: APP_NAME,
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Terms of Service | ${APP_NAME}`,
    description: `Understand the rules, terms, and usage policies that guide interactions and activities on ${APP_NAME}.`,
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <TermsOfServicePage />
    </DashboardLayout>
  );
}
