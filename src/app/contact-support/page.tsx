import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_NAME} from '@/constants/settings';
import {ContactSupportPage} from '@/modules/dashboard/contact-support';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Contact Support | ${APP_NAME}`,
  description: `Get in touch with ${APP_NAME} support for any questions, issues, or feedback regarding your account or experience.`,
};

export default function Page() {
  return (
    <DashboardLayout>
      <ContactSupportPage />
    </DashboardLayout>
  );
}
