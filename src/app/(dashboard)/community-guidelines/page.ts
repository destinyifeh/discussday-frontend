import {APP_NAME} from '@/constants/settings';
import {CommunityGuidelines} from '@/modules/dashboard/commuity-guidelines';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Community Guidelines`,
  description: `Read the ${APP_NAME} community guidelines to understand the rules, standards, and best practices for engaging safely and respectfully.`,
};

export default CommunityGuidelines;
