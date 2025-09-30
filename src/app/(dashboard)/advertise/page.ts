import {APP_NAME} from '@/constants/settings';
import {AdvertisePage} from '@/modules/dashboard/advertise';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Advertise`,
  description: `Learn how to promote your business or content on ${APP_NAME} with our advertising tools and targeting options.`,
};

export default AdvertisePage;
