import {APP_NAME} from '@/constants/settings';
import {UserFollowersPage} from '@/modules/dashboard/people/followers';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Followers`,
  description: `View the users who are following your account on ${APP_NAME} and engage with your growing community.`,
};

export default UserFollowersPage;
