import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {AdPlanPage} from '@/modules/dashboard/advertise/plan';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Create Ad | ${APP_NAME}`,
  description: `Create and manage your ads on ${APP_NAME}. Reach your audience effectively with our tools and targeting options.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <AdPlanPage />
    </DashboardLayout>
  );
}
