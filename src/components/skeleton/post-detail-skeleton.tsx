import {PageHeader} from '../app-headers';
import CommentSkeleton from './comment-skeleton';
import PostSkeleton from './post-skeleton';

const PostDetailSkeleton = () => {
  return (
    <div>
      <PageHeader title="Discuss" />
      <div className="pb-2 border-b border-app-border">
        <PostSkeleton />
      </div>

      <div className="px-4 py-3 border-b border-app-border flex justify-between items-center">
        <h2 className="font-bold text-lg">All replies</h2>
      </div>

      <div className="divide-y divide-app-border">
        {[...Array(3)].map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default PostDetailSkeleton;
