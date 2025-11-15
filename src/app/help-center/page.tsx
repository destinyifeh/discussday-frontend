import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {HelpCenterPage} from '@/modules/dashboard/help-center';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Help Center | ${APP_NAME}`,
  description: `Find answers to your questions and get support for using ${APP_NAME}. Explore guides, FAQs, and troubleshooting tips.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/help-center',
    title: `Help Center | ${APP_NAME}`,
    description: `Browse the ${APP_NAME} Help Center for FAQs, guides, troubleshooting tips, and step-by-step solutions to common issues.`,
    siteName: APP_NAME,
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Help Center | ${APP_NAME}`,
    description: `Get assistance using ${APP_NAME}. Read FAQs, guides, and solutions to common issues in the Help Center.`,
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <HelpCenterPage />
    </DashboardLayout>
  );
}
