import {APP_NAME} from '@/constants/settings';
import {ProfilePage} from '@/modules/dashboard/profile';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Profile | ${APP_NAME}`,
  description: `View and manage your personal profile on ${APP_NAME}, including your posts, activity, and account details.`,
};

export default ProfilePage;
