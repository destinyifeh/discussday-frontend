import ScreenLoader from '@/components/feedbacks/screen-loader';
import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {AdPlanPage} from '@/modules/dashboard/advertise/plan';
import {Metadata} from 'next';
import {Suspense} from 'react';

export const metadata: Metadata = {
  title: `Create Ad | ${APP_NAME}`,
  description: `Create and manage your ads on ${APP_NAME}. Reach your audience effectively with our tools and targeting options.`,
  openGraph: {
    type: 'website',
    url: 'https://discussday.com/create-ad',
    title: `Create Ad | ${APP_NAME}`,
    description: `Easily create and manage ads on ${APP_NAME}. Utilize targeting options and advertising tools to reach your ideal audience.`,
    siteName: APP_NAME,
    images: [{url: 'https://discussday.com/logo_blue.png'}],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Create Ad | ${APP_NAME}`,
    description: `Set up and manage your ads on ${APP_NAME}. Reach the right audience with our advertising tools and targeting options.`,
    creator: '@Discussday',
    images: ['https://discussday.com/logo_blue.png'],
  },
};

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback={<ScreenLoader />}>
        <AdPlanPage />
      </Suspense>
    </DashboardLayout>
  );
}
