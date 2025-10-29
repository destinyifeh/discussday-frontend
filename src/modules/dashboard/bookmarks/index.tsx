'use client';
import AuthPrompt from '@/components/feedbacks/auth-prompt';
import {MobileBottomTab} from '@/components/layouts/dashboard/mobile-bottom-tab';
import MobileNavigation from '@/components/layouts/dashboard/mobile-navigation';
import {BookmarkPostList} from '@/components/post/post-list';
import {useAuthStore} from '@/hooks/stores/use-auth-store';

import {useRouter} from 'next/navigation';

export const BookmarksPage = () => {
  const navigate = useRouter();
  const {currentUser} = useAuthStore(state => state);

  if (!currentUser) {
    return (
      <div>
        <MobileNavigation title="Bookmarks" />
        <AuthPrompt page="bookmarks" />
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
          <MobileBottomTab />
        </div>
      </div>
    );
  }

  return (
    <div>
      <BookmarkPostList />
    </div>
  );
};
