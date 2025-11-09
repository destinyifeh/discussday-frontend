import {APP_NAME} from '@/constants/settings';
import {SettingsPage} from '@/modules/dashboard/settings';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Settings | ${APP_NAME}`,
  description: `Manage your account in ${APP_NAME}'s settings. Customize your experience to suit your needs.`,
};

export default SettingsPage;
