import {APP_NAME} from '@/constants/settings';
import {AdPerformancePage} from '@/modules/dashboard/advertise/ad-performance';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Ad Performance`,
  description: `Track and analyze the performance of your ads on ${APP_NAME} with detailed insights and metrics.`,
};

export default AdPerformancePage;
