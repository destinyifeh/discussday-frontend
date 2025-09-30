import {APP_NAME} from '@/constants/settings';
import ReportPage from '@/modules/dashboard/report';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Report`,
  description: `Report content or users on ${APP_NAME} that violate our policies. Help us keep the community safe and respectful.`,
};

export default ReportPage;
