import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {AdvertisePage} from '@/modules/dashboard/advertise';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Advertise | ${APP_NAME}`,
  description: `Learn how to promote your business or content on ${APP_NAME} with our advertising tools and targeting options.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/advertise',
    title: `Advertise | ${APP_NAME}`,
    description: `Discover advertising opportunities on ${APP_NAME}. Reach your audience effectively with our tools, targeting, and promotional options.`,
    siteName: APP_NAME,
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Advertise | ${APP_NAME}`,
    description: `Promote your business or content on ${APP_NAME}. Use our advertising tools and targeting options to reach the right audience.`,
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <AdvertisePage />
    </DashboardLayout>
  );
}
