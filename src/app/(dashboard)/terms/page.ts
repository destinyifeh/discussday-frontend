import {APP_NAME} from '@/constants/settings';
import {TermsOfServicePage} from '@/modules/dashboard/terms-of-service';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Terms of Service`,
  description: `Read the terms and conditions for using ${APP_NAME}. Learn about user rights, responsibilities, and policies.`,
};

export default TermsOfServicePage;
