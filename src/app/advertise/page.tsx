import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {AdvertisePage} from '@/modules/dashboard/advertise';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Advertise | ${APP_NAME}`,
  description: `Learn how to promote your business or content on ${APP_NAME} with our advertising tools and targeting options.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <AdvertisePage />
    </DashboardLayout>
  );
}
