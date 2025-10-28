'use client';

import AdCard from '@/components/ad/ad-card';
import {PageHeader} from '@/components/app-headers';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import AuthPrompt from '@/components/feedbacks/auth-prompt';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {MobileBottomTab} from '@/components/layouts/dashboard/mobile-bottom-tab';
import MobileNavigation from '@/components/layouts/dashboard/mobile-navigation';
import UserCommentCard from '@/components/post/comments/user-comment-card';
import PostCard from '@/components/post/post-card';
import PostSkeleton from '@/components/skeleton/post-skeleton';
import ProfileSkeleton from '@/components/skeleton/profile-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {toast} from '@/components/ui/toast';
import {ALLOW_FIXED_MOBILE_BOTTOM_TAB} from '@/constants/settings';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {usePostStore} from '@/hooks/stores/use-post-store';
import {queryClient} from '@/lib/client/query-client';
import {normalizeDomain, urlFormatter} from '@/lib/formatter';

import {commentService} from '@/services/comment-service';
import {postService} from '@/services/post-service';
import {userService} from '@/services/user-management';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {Calendar, Link as LinkIcon, MapPin, Settings} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

export const PostPlaceholder = ({
  tab,
  isOwnProfile = true,
}: {
  tab: string;
  isOwnProfile?: boolean;
}) => {
  const navigate = useRouter();

  return (
    <div className="p-8 text-center">
      {tab === 'posts' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          {isOwnProfile && (
            <Button
              className="mt-4 bg-app hover:bg-app/90"
              onClick={() => navigate.push('/discuss')}>
              Create your first post
            </Button>
          )}
        </div>
      )}

      {tab === 'replies' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No replies yet</h2>
          <p className="text-app-gray">
            When {isOwnProfile ? 'you reply' : 'this user replies'} to posts,
            they'll show up here.
          </p>
        </div>
      )}

      {tab === 'likes' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No likes yet</h2>
          <p className="text-app-gray">
            When {isOwnProfile ? 'you like' : 'this user likes'} posts, they'll
            show up here.
          </p>
        </div>
      )}

      {tab === 'mentions' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No mentions yet</h2>
          <p className="text-app-gray">
            When{' '}
            {isOwnProfile ? 'someone mention you' : 'this user is mentioned'},
            they'll show up here.
          </p>
        </div>
      )}
    </div>
  );
};

export const ProfilePage = () => {
  const {currentUser} = useAuthStore(state => state);
  const [activeTab, setActiveTab] = useState('posts');
  const [showGoUp, setShowGoUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const lastScrollTop = useRef(0);
  const {resetCommentSection} = usePostStore(state => state);

  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (ref === 'mentions') {
      setActiveTab('mentions');
    }
    if (ref === 'likes') {
      setActiveTab('likes');
    }
    setMounted(true);
    resetCommentSection();
  }, []);

  const shouldQuery = !!currentUser;

  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['user-profile-posts', activeTab],
    queryFn: ({pageParam = 1}) =>
      userService.getUserPosts(pageParam, 10, activeTab),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
    enabled: shouldQuery,
  });

  const userData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('user posts dataa', userData);

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['user-profile-posts', activeTab],
      });

      const previousPosts = queryClient.getQueryData([
        'user-profile-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasLiked = post.data.likedBy.includes(userId);
                  const newLikedBy = hasLiked
                    ? post.data.likedBy.filter((id: string) => id !== userId)
                    : [...post.data.likedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      likedBy: newLikedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-profile-posts', activeTab],
      });
    },
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['user-profile-posts', activeTab],
      });

      const previousPosts = queryClient.getQueryData([
        'user-profile-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasBookmarked = post.data.bookmarkedBy.includes(userId);
                  const newBookmarkedBy = hasBookmarked
                    ? post.data.bookmarkedBy.filter(
                        (id: string) => id !== userId,
                      )
                    : [...post.data.bookmarkedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      bookmarkedBy: newBookmarkedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  // const isNotCurrentUser =
  //   user.toLowerCase() !== currentUser?.username.toLowerCase();

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      commentService.likeCommentRequestAction(commentId),

    onMutate: async (commentId: any) => {
      await queryClient.cancelQueries({
        queryKey: ['user-profile-posts', activeTab],
      });

      const previousData = queryClient.getQueryData([
        'user-profile-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        (oldData: any) => {
          if (!oldData) return previousData;

          const userId = currentUser?._id;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((comment: any) => {
                if (comment.data._id !== commentId) return comment;

                // mutual exclusivity logic
                const hasLiked = comment.data.likedBy.includes(userId);
                const hasDisliked = comment.data.dislikedBy.includes(userId);

                let newLikedBy = comment.data.likedBy;
                let newDislikedBy = comment.data.dislikedBy;

                if (hasLiked) {
                  // remove like if already liked
                  newLikedBy = newLikedBy.filter((id: string) => id !== userId);
                } else {
                  // add like
                  newLikedBy = [...newLikedBy, userId];
                  // remove dislike if user had disliked before
                  newDislikedBy = newDislikedBy.filter(
                    (id: string) => id !== userId,
                  );
                }

                return {
                  ...comment,
                  data: {
                    ...comment.data,
                    likedBy: newLikedBy,
                    dislikedBy: newDislikedBy,
                  },
                };
              }),
            })),
          };
        },
      );

      return {previousData};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        context.previousComments,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  const dislikeCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      commentService.dislikeCommentRequestAction(commentId),

    onMutate: async (commentId: any) => {
      await queryClient.cancelQueries({
        queryKey: ['user-profile-posts', activeTab],
      });

      const previousData = queryClient.getQueryData([
        'user-profile-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        (oldData: any) => {
          if (!oldData) return previousData;

          const userId = currentUser?._id;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((comment: any) => {
                if (comment.data._id !== commentId) return comment;

                // mutual exclusivity logic
                const hasLiked = comment.data.likedBy.includes(userId);
                const hasDisliked = comment.data.dislikedBy.includes(userId);

                let newLikedBy = comment.data.likedBy;
                let newDislikedBy = comment.data.dislikedBy;

                if (hasDisliked) {
                  // remove dislike if already disliked
                  newDislikedBy = newDislikedBy.filter(
                    (id: string) => id !== userId,
                  );
                } else {
                  // add dislike
                  newDislikedBy = [...newDislikedBy, userId];
                  // remove like if user had liked before
                  newLikedBy = newLikedBy.filter((id: string) => id !== userId);
                }

                return {
                  ...comment,
                  data: {
                    ...comment.data,
                    likedBy: newLikedBy,
                    dislikedBy: newDislikedBy,
                  },
                };
              }),
            })),
          };
        },
      );

      return {previousData};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['user-profile-posts', activeTab],
        context.previousComments,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide
      setShowBottomTab(false);
      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show
      setShowBottomTab(true);
      setShowMobileNav(true);
    }
    // Show "go up" button if scrolled more than 300px
    // setShowGoUp(scrollTop > 300);

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };
  if (!currentUser) {
    return (
      <div>
        <PageHeader title="Profile" />
        <AuthPrompt page="profile" />
      </div>
    );
  }
  return (
    <div>
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <MobileNavigation title="Profile" />
      </div>

      <Virtuoso
        className="custom-scrollbar mb-12 md:mb-0"
        style={{height: '100vh'}}
        data={userData}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div className="mt-15 md:mt-0">
              <PageHeader
                title={currentUser?.username}
                description={`${totalCount} ${activeTab}`}
                showBackIcon={false}
              />

              <div className="border-b overflow-y-auto border-app-border">
                <div className="h-40 bg-app/20 relative overflow-hidden">
                  {currentUser?.cover_avatar ? (
                    <img
                      src={currentUser.cover_avatar}
                      alt="Cover avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                {/* <div className="h-40 bg-app/20"></div> */}
                <div className="px-4 pb-4">
                  <div className="flex justify-between relative">
                    <div className="w-24 h-24 rounded-full absolute -top-12">
                      <Avatar className="h-24 w-24 border-4 border-white">
                        <AvatarImage src={currentUser?.avatar ?? undefined} />
                        <AvatarFallback className="capitalize text-app text-3xl">
                          {currentUser?.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        className="rounded-full border-app-border active:scale-90 transition-transform duration-150"
                        onClick={() =>
                          navigate.push(
                            `/profile/${currentUser?.username}/edit`,
                          )
                        }>
                        Edit profile
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full border-app-border active:scale-90 transition-transform duration-150"
                        onClick={() => navigate.push('/settings')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="font-bold text-xl capitalize">
                      {currentUser?.username}
                    </h2>
                    {/* <p className="text-app-gray">@{profileUser.username}</p> */}

                    <div className="mt-3 text-app-gray">
                      <div className="space-y-1">
                        {currentUser?.bio && (
                          <div className="flex items-center gap-2">
                            {/* <MapPin size={16} /> */}
                            <p className="text-base">{currentUser.bio}</p>
                          </div>
                        )}
                        {currentUser?.website && (
                          <div className="flex items-center gap-2">
                            <LinkIcon size={16} />
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              href={urlFormatter(currentUser?.website)}
                              className="text-app">
                              {normalizeDomain(currentUser?.website)}
                            </Link>
                          </div>
                        )}

                        {currentUser?.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <p className="text-base">{currentUser.location}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            Joined{' '}
                            {moment(currentUser?.createdAt).format('MMMM YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-3">
                      <Link
                        className="flex items-center gap-1 cursor-pointer hover:underline active:scale-90 transition-transform duration-150"
                        href={`/profile/${currentUser?.username}/following`}>
                        <span className="font-bold">
                          {currentUser?.following?.length}
                        </span>
                        <span className="text-app-gray">Following</span>
                      </Link>
                      <Link
                        className="flex items-center gap-1 cursor-pointer hover:underline active:scale-90 transition-transform duration-150"
                        href={`/profile/${currentUser?.username}/followers`}>
                        <span className="font-bold">
                          {currentUser?.followers?.length}
                        </span>
                        <span className="text-app-gray">Followers</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs
                defaultValue="posts"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-4 bg-transparent">
                  <TabsTrigger
                    value="posts"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="replies"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Replies
                  </TabsTrigger>
                  <TabsTrigger
                    value="likes"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Likes
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentions"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Mentions
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          ),
          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <PostPlaceholder tab={activeTab} />;
          },
          Footer: () =>
            status === 'error' ? (
              <ErrorFeedback
                showRetry
                onRetry={refetch}
                message="We encountered an unexpected error. Please try again"
                variant="minimal"
              />
            ) : isFetchingNextPage ? (
              <LoadingMore />
            ) : fetchNextError ? (
              <LoadMoreError
                fetchNextError={fetchNextError}
                handleFetchNext={handleFetchNext}
              />
            ) : null,
        }}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        }}
        itemContent={(index, post) => {
          if (status === 'pending') {
            return <PostSkeleton />;
          }

          if (!post || !post.data) return null;

          if (post._type === 'ad') {
            return <AdCard ad={post.data} key={post.data._id} />;
          }

          const key = post.data._id || `${activeTab}-${index}`;

          if (
            post._type === 'post' &&
            activeTab === 'replies' &&
            post.data.commentBy?.username
          ) {
            return (
              <UserCommentCard
                key={key}
                comment={post.data}
                isFrom="replies"
                onLike={() => likeCommentMutation.mutate(post.data._id)}
                onDisLike={() => dislikeCommentMutation.mutate(post.data._id)}
              />
            );
          }

          if (
            post._type === 'post' &&
            activeTab === 'mentions' &&
            post.data?.quotedComment?.quotedUser
          ) {
            return (
              <UserCommentCard
                key={key}
                comment={post.data}
                isFrom="mentions"
                onLike={() => likeCommentMutation.mutate(post.data._id)}
                onDisLike={() => dislikeCommentMutation.mutate(post.data._id)}
              />
            );
          }

          if (post._type === 'post' && post.data.user?._id) {
            return (
              <PostCard
                key={key}
                post={post.data}
                onLike={() => likePostMutation.mutate(post.data._id)}
                onBookmark={() => bookmarkPostMutation.mutate(post.data._id)}
              />
            );
          }

          return <PostSkeleton />;
        }}
      />

      {/* {showGoUp && (
          <button
            onClick={() => {
              virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
            }}
            className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
            <ArrowUp size={20} />
          </button>
        )} */}
      {ALLOW_FIXED_MOBILE_BOTTOM_TAB ? (
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
          <MobileBottomTab />
        </div>
      ) : (
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 transition-transform duration-300 ${
            showBottomTab ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <MobileBottomTab />
        </div>
      )}
    </div>
  );
};
