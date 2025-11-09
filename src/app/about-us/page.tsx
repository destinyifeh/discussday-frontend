import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {AboutPage} from '@/modules/dashboard/about';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `About | ${APP_NAME}`,
  description: `Learn more about ${APP_NAME}, our mission and discover why we created a space for meaningful discussions.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <AboutPage />
    </DashboardLayout>
  );
}
