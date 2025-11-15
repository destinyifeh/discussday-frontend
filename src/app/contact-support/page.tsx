import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {ContactSupportPage} from '@/modules/dashboard/contact-support';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Contact Support | ${APP_NAME}`,
  description: `Get in touch with ${APP_NAME} support for any questions, issues, or feedback regarding your account or experience.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/contact-support',
    title: `Contact Support | ${APP_NAME}`,
    description: `Reach out to the ${APP_NAME} support team for help with your account, technical issues, platform concerns, or general inquiries.`,
    siteName: APP_NAME,
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Contact Support | ${APP_NAME}`,
    description: `Need help using ${APP_NAME}? Contact our support team for quick assistance with any questions or issues.`,
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <ContactSupportPage />
    </DashboardLayout>
  );
}
