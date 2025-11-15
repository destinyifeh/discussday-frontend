import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {AboutPage} from '@/modules/dashboard/about';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `About | ${APP_NAME}`,
  description: `Learn more about ${APP_NAME}, our mission and discover why we created a space for meaningful discussions.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/about-us',
    title: 'About | Discussday',
    description:
      'Discover the mission behind Discussday and learn why we built a platform for meaningful conversations and community engagement.',
    siteName: 'Discussday',
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'About | Discussday',
    description:
      'Learn about the mission and purpose of Discussday — a platform created for meaningful conversations and trending discussions.',
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <AboutPage />
    </DashboardLayout>
  );
}
