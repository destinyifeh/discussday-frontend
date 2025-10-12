'use client';

import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {queryClient} from '@/lib/client/query-client';
import {postService} from '@/modules/posts/actions';
import {useMutation, useQuery} from '@tanstack/react-query';
import ErrorFeedback from '../feedbacks/error-feedback';
import PostSkeleton from '../skeleton/post-skeleton';
import {toast} from '../ui/toast';
import PostCard from './post-card';

export const RelatedPosts = ({postId}: {postId: string}) => {
  const {currentUser} = useAuthStore(state => state);
  const shouldQuery = !!postId;
  const {
    isLoading,
    error,
    data: posts,
    status: postStatus,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['related-posts', postId],
    queryFn: () => postService.getRelatedPostRequestAction(postId),
    retry: 1,
    enabled: shouldQuery,
  });

  console.log(posts, 'related dataa');

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async likedPostId => {
      // Cancel any outgoing fetches for this query
      await queryClient.cancelQueries({queryKey: ['related-posts', postId]});

      // Snapshot the previous data
      const previousPosts = queryClient.getQueryData(['related-posts', postId]);

      // Optimistically update the cache
      queryClient.setQueryData(['related-posts', postId], (oldData: any) => {
        if (!oldData) return previousPosts;

        const userId = currentUser?._id;

        return oldData.map((post: any) => {
          if (post._id !== likedPostId) return post;

          const hasLiked = post.likedBy.includes(userId);
          const newLikedBy = hasLiked
            ? post.likedBy.filter((id: string) => id !== userId)
            : [...post.likedBy, userId];

          return {...post, likedBy: newLikedBy};
        });
      });

      return {previousPosts};
    },

    onError: (err, likedPostId, context: any) => {
      // Roll back optimistic update if error
      queryClient.setQueryData(
        ['related-posts', postId],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    // Optional: refetch to sync with server after optimistic update
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['related-posts', postId]});
    },
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async bookmarkedPostId => {
      // Cancel any ongoing fetches for the related posts of the current post
      await queryClient.cancelQueries({queryKey: ['related-posts', postId]});

      // Snapshot previous cache
      const previousPosts = queryClient.getQueryData(['related-posts', postId]);

      // Optimistic update
      queryClient.setQueryData(['related-posts', postId], (oldData: any) => {
        if (!oldData) return previousPosts;

        const userId = currentUser?._id;

        // Toggle the bookmark for the matched post
        return oldData.map((post: any) => {
          if (post._id !== bookmarkedPostId) return post;

          const hasBookmarked = post.bookmarkedBy.includes(userId);
          const newBookmarkedBy = hasBookmarked
            ? post.bookmarkedBy.filter((id: string) => id !== userId)
            : [...post.bookmarkedBy, userId];

          return {...post, bookmarkedBy: newBookmarkedBy};
        });
      });

      return {previousPosts};
    },

    onError: (err, bookmarkedPostId, context: any) => {
      queryClient.setQueryData(
        ['related-posts', postId],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {
      // Optional – revalidate data after optimistic update
      queryClient.invalidateQueries({queryKey: ['related-posts', postId]});
    },
  });

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (postStatus === 'error') {
    return (
      <ErrorFeedback
        showRetry
        onRetry={refetchPost}
        message="Failed to load related posts"
        variant="minimal"
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts && posts.length > 0 ? (
        posts.map((post: any) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={() => likePostMutation.mutate(post._id)}
            onBookmark={() => bookmarkPostMutation.mutate(post._id)}
          />
        ))
      ) : (
        <p className="text-sm text-gray-500">No related posts found.</p>
      )}
    </div>
  );
};
