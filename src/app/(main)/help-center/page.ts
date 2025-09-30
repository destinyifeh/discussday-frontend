import {APP_NAME} from '@/constants/settings';
import {PublicHelpCenterPage} from '@/modules/main/help-center';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Help Center`,
  description: `Find answers to your questions and get support for using ${APP_NAME}. Explore guides, FAQs, and troubleshooting tips.`,
};

export default PublicHelpCenterPage;
