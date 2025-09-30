import {APP_NAME} from '@/constants/settings';
import {PrivacyPolicyPage} from '@/modules/main/privacy-policy';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Privacy Policy`,
  description: `Understand how ${APP_NAME} collects, uses, and protects your data. Your privacy and security are our priority.`,
};

export default PrivacyPolicyPage;
