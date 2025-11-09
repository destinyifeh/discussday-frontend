import {APP_NAME} from '@/constants/settings';
import {UserFollowingPage} from '@/modules/dashboard/people/following';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Following | ${APP_NAME}`,
  description: `See the accounts you’re following on ${APP_NAME} and keep up with their latest posts and activity.`,
};

export default UserFollowingPage;
