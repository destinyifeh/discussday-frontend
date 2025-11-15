import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {PrivacyPolicyPage} from '@/modules/dashboard/privacy-policy';
import {Metadata} from 'next';
export const metadata: Metadata = {
  title: `Privacy Policy | ${APP_NAME}`,
  description: `Understand how ${APP_NAME} collects, uses, and protects your data. Your privacy and security are our priority.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/privacy-policy',
    title: `Privacy Policy | ${APP_NAME}`,
    description: `Learn how ${APP_NAME} manages, protects, and uses your personal information. Read our data protection practices and privacy commitments.`,
    siteName: APP_NAME,
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Privacy Policy | ${APP_NAME}`,
    description: `Read how ${APP_NAME} safeguards your data and ensures your privacy. Learn about our data usage and protection policies.`,
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <PrivacyPolicyPage />
    </DashboardLayout>
  );
}
