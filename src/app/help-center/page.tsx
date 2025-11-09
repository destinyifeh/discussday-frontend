import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {HelpCenterPage} from '@/modules/dashboard/help-center';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Help Center | ${APP_NAME}`,
  description: `Find answers to your questions and get support for using ${APP_NAME}. Explore guides, FAQs, and troubleshooting tips.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <HelpCenterPage />
    </DashboardLayout>
  );
}
