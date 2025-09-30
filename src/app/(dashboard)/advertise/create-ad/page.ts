import {APP_NAME} from '@/constants/settings';
import {AdPlanPage} from '@/modules/dashboard/advertise/plan';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Create Ad`,
  description: `Create and manage your ads on ${APP_NAME}. Reach your audience effectively with our tools and targeting options.`,
};

export default AdPlanPage;
