'use client';
import {PageHeader} from '@/components/app-headers';
import AuthPrompt from '@/components/feedbacks/auth-prompt';
import {BookmarkPostList} from '@/components/post/post-list';
import {useAuthStore} from '@/hooks/stores/use-auth-store';

import {useRouter} from 'next/navigation';

export const BookmarksPage = () => {
  const navigate = useRouter();
  const {currentUser} = useAuthStore(state => state);

  if (!currentUser) {
    return (
      <div>
        <PageHeader title="Bookmarks" />
        <AuthPrompt page="bookmarks" />
      </div>
    );
  }

  return (
    <div>
      <BookmarkPostList />
    </div>
  );
};
