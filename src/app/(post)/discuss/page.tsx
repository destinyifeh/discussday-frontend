import ScreenLoader from '@/components/feedbacks/screen-loader';
import {CreatePostPage} from '@/modules/posts/create-post';
import {Suspense} from 'react';

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CreatePostPage />
    </Suspense>
  );
}
