import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {PrivacyPolicyPage} from '@/modules/dashboard/privacy-policy';
import {Metadata} from 'next';
export const metadata: Metadata = {
  title: `Privacy Policy | ${APP_NAME}`,
  description: `Understand how ${APP_NAME} collects, uses, and protects your data. Your privacy and security are our priority.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <PrivacyPolicyPage />
    </DashboardLayout>
  );
}
