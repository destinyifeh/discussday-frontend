import {APP_NAME} from '@/constants/settings';
import {AboutPage} from '@/modules/dashboard/about';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | About`,
  description: `Learn more about ${APP_NAME}, our mission and discover why we created a space for meaningful discussions.`,
};

export default AboutPage;
