import {APP_NAME} from '@/constants/settings';
import {Users} from '@/modules/dashboard/people/users';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: ` Users | ${APP_NAME}`,
  description: `Browse and discover users on ${APP_NAME}. Connect with people and expand your network.`,
};

export default Users;
