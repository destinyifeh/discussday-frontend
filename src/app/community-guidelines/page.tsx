import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {CommunityGuidelines} from '@/modules/dashboard/commuity-guidelines';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Community Guidelines | ${APP_NAME}`,
  description: `Read the ${APP_NAME} community guidelines to understand the rules, standards, and best practices for engaging safely and respectfully.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <CommunityGuidelines />
    </DashboardLayout>
  );
}
