import {APP_NAME} from '@/constants/settings';
import {ExplorePage} from '@/modules/dashboard/explore';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Explore`,
  description: `Discover trending posts, topics, and communities on ${APP_NAME}. Find content that matters to you.`,
};

export default ExplorePage;
