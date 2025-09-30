import {APP_NAME} from '@/constants/settings';
import {BookmarksPage} from '@/modules/dashboard/bookmarks';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Bookmarks`,
  description: `View and manage all the posts you’ve saved on ${APP_NAME} for easy access later.`,
};

export default BookmarksPage;
