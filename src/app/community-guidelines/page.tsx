import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {CommunityGuidelines} from '@/modules/dashboard/commuity-guidelines';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Community Guidelines | ${APP_NAME}`,
  description: `Read the ${APP_NAME} community guidelines to understand the rules, standards, and best practices for engaging safely and respectfully.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/community-guidelines',
    title: `Community Guidelines | ${APP_NAME}`,
    description: `Explore the ${APP_NAME} community guidelines to learn about the rules, behavior standards, and expectations for creating a safe and respectful environment.`,
    siteName: APP_NAME,
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Community Guidelines | ${APP_NAME}`,
    description: `Learn the rules and behavior standards that help keep ${APP_NAME} safe, respectful, and enjoyable for everyone.`,
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <CommunityGuidelines />
    </DashboardLayout>
  );
}
