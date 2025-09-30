import {APP_NAME} from '@/constants/settings';
import {AdsInfoPage} from '@/modules/main/ads-info';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Ads Info`,
  description: `Learn more about how ads work on ${APP_NAME}, why you see certain ads, and how we ensure transparency for our users.`,
};

export default AdsInfoPage;
