import {APP_NAME} from '@/constants/settings';
import {Metadata} from 'next';
import {NotificationsPage} from './../../../modules/dashboard/notifications/index';

export const metadata: Metadata = {
  title: `${APP_NAME} | Notifications`,
  description: `Stay updated with the latest alerts, mentions, and activity related to your account on ${APP_NAME}.`,
};

export default NotificationsPage;
