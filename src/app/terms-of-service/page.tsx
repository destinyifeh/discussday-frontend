import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {TermsOfServicePage} from '@/modules/dashboard/terms-of-service';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Terms of Service | ${APP_NAME}`,
  description: `Read the terms and conditions for using ${APP_NAME}. Learn about user rights, responsibilities, and policies.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <TermsOfServicePage />
    </DashboardLayout>
  );
}
