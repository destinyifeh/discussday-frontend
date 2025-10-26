'use client';

import AdCard from '@/components/ad/ad-card';
import {CustomPageHeader, PageHeader} from '@/components/app-headers';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import UserCommentCard from '@/components/post/comments/user-comment-card';
import PostCard from '@/components/post/post-card';
import PostSkeleton from '@/components/skeleton/post-skeleton';
import ProfileSkeleton from '@/components/skeleton/profile-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {queryClient} from '@/lib/client/query-client';
import {normalizeDomain} from '@/lib/formatter';
import {cn} from '@/lib/utils';

import {commentService} from '@/services/comment-service';
import {postService} from '@/services/post-service';
import {userService} from '@/services/user-management';
import {UserProps} from '@/types/user.types';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowUp,
  Calendar,
  Link as LinkIcon,
  Mail,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useReportActions} from '../actions/action-hooks/report.action-hooks';

export const PostPlaceholder = ({
  tab,
  isOwnProfile = false,
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
              onClick={() => navigate.push('/create')}>
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
    </div>
  );
};

export const PeoplePage = () => {
  const lastScrollTop = useRef(0);
  const {user} = useParams<{user: string}>();
  const {currentUser, setUser} = useAuthStore(state => state);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [showGoUp, setShowGoUp] = useState(false);
  const navigate = useRouter();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [isPending, setIsPending] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [open, setOpen] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const reportReasons = [
    {id: 'spam', label: 'Spam or misleading content'},
    {id: 'harassment', label: 'Harassment or bullying'},
    {id: 'inappropriate', label: 'Inappropriate content'},
    {id: 'impersonation', label: 'Impersonation'},
    {id: 'misinformation', label: 'Misinformation'},
    {id: 'other', label: 'Other'},
  ];
  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });
  const {reportUser} = useReportActions();
  // Find the user profile (using our mock data, in real app would fetch from backend)

  const shouldQuery = !!user;
  const {
    isLoading,
    error,
    data: userData,
    refetch,
  } = useQuery({
    queryKey: ['user', user],
    queryFn: () => userService.getUserByUsername(user),
    retry: false,
    enabled: shouldQuery,
  });
  console.log(shouldQuery, 'should query', error);

  console.log(userData, 'should query dataa');

  const shouldQueryPost = !!userData?.user?._id;
  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error: userPostsErr,
  } = useInfiniteQuery({
    queryKey: ['public-user-posts', activeTab],
    queryFn: ({pageParam = 1}) =>
      userService.getPublicUserPosts(
        pageParam,
        10,
        activeTab,
        userData.user._id,
      ),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
    enabled: shouldQueryPost,
  });

  const userPostData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('user posts dataa', userData);

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['public-user-posts', activeTab],
      });

      const previousPosts = queryClient.getQueryData([
        'public-user-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['public-user-posts', activeTab],
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
        ['public-user-posts', activeTab],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['public-user-posts', activeTab],
      });
    },
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['public-user-posts', activeTab],
      });

      const previousPosts = queryClient.getQueryData([
        'public-user-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['public-user-posts', activeTab],
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
        ['public-user-posts', activeTab],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  //comment like/dislike

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      commentService.likeCommentRequestAction(commentId),

    onMutate: async (commentId: any) => {
      await queryClient.cancelQueries({
        queryKey: ['public-user-posts', activeTab],
      });

      const previousData = queryClient.getQueryData([
        'public-user-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['public-user-posts', activeTab],
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
        ['public-user-posts', activeTab],
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
        queryKey: ['public-user-posts', activeTab],
      });

      const previousData = queryClient.getQueryData([
        'public-user-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['public-user-posts', activeTab],
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
        ['public-user-posts', activeTab],
        context.previousComments,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error?.message === 'User not found') {
    return <ErrorFeedback showGoBack message="User not found" />;
  }

  if (userData?.code !== '200') {
    return <ErrorFeedback showGoBack showRetry onRetry={refetch} />;
  }

  const handleReportUser = (userId: string) => {
    setOpen(false);
    const payload = {
      reason: reason,
      userId: userId,
      note: details,
    };

    reportUser.mutate(payload, {
      onSuccess(data, variables, context) {
        console.log(data, 'report data');
        toast.success('Report submitted. Our team will review it shortly.');
      },
      onError(error, variables, context) {
        console.log(error, 'user report err');

        toast.error(
          'Sorry, we were unable to submit your report. Please try again.',
        );
      },
    });
  };

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide

      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show

      setShowMobileNav(true);
    }
    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const {
    username,
    avatar,
    cover_avatar,
    createdAt,
    followers,
    following,
    website,
    bio,
    email,
    _id,
  } = userData.user;

  const isOwnProfile = username === currentUser?.username;

  const isFollowing = currentUser?.following?.includes(_id?.toString());

  console.log(followers, 'datameeefollowers');
  console.log(following, 'datameeelowing');
  console.log(
    currentUser?.following,
    'cyurrrrreeellowers',
    isFollowing,
    currentUser?._id,
    _id,
  );
  const handleEmailNavigation = () => {
    navigate.push(`/email/${username}`);
  };

  const handleFollowUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPending(true);
    mutate(_id, {
      onSuccess(response, variables, context) {
        console.log(response, 'datameee');

        const {
          currentUserFollowers,
          currentUserFollowings,
          message,
          isFollowing,
          following,
          followers,
        } = response.data;

        setUser({
          ...(currentUser as UserProps),
          following: currentUserFollowings,
        });

        // Invalidate the cached user data
        //queryClient.invalidateQueries({queryKey: ['user', username]});
        queryClient.setQueryData(['user', username], (oldData: any) => ({
          ...oldData,
          user: {
            ...oldData.user,
            followers,
            following,
          },
        }));

        toast.success(message);
      },

      onError(error, variables, context) {
        console.log(error, 'err');
      },
      onSettled(data, error, variables, context) {
        setIsPending(false);
      },
    });
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportReason) {
      toast.error('Please select a reason for your report');
      return;
    }

    setIsSubmittingReport(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        `Your report against @${username} has been submitted for review`,
      );
      setIsSubmittingReport(false);
      setIsReportDialogOpen(false);
      setReportReason('');
      setReportDetails('');
    }, 1000);
  };

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };
  return (
    <div className="">
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <CustomPageHeader
          title={username}
          description={`${totalCount} ${activeTab}`}
        />
      </div>
      <div className="hidden md:block">
        <PageHeader
          title={username}
          description={`${totalCount} ${activeTab}`}
        />
      </div>
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        data={userPostData}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div className="mt-15 lg:mt-0">
              <div className="border-b overflow-y-auto border-app-border">
                <div className="h-40 bg-app/20 relative overflow-hidden">
                  {cover_avatar ? (
                    <img
                      src={cover_avatar}
                      alt="Cover avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="px-4 pb-4">
                  <div className="flex justify-between relative">
                    <div className="w-24 h-24 rounded-full absolute -top-12">
                      <Avatar className="h-24 w-24 border-4 border-white">
                        <AvatarImage src={avatar ?? undefined} />
                        <AvatarFallback className="capitalize text-app text-3xl">
                          {username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1"></div>
                    {currentUser && (
                      <>
                        {!isOwnProfile && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={handleFollowUser}
                              disabled={isPending}
                              className={cn(
                                'rounded-full',
                                isFollowing
                                  ? 'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black dark:text-white'
                                  : 'bg-app text-white hover:bg-app/90',
                              )}>
                              {isFollowing ? 'Following' : 'Follow'}
                            </Button>

                            <Button
                              variant="outline"
                              className="rounded-full"
                              onClick={handleEmailNavigation}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </Button>

                            <Button
                              onClick={() => setOpen(true)}
                              variant="ghost"
                              size="icon"
                              className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-16">
                    <h2 className="font-bold text-xl capitalize">{username}</h2>

                    <div className="mt-3 text-app-gray">
                      <div className="space-y-1">
                        {bio && (
                          <div className="flex items-center gap-2">
                            {/* <MapPin size={16} /> */}
                            <p className="text-base">{bio}</p>
                          </div>
                        )}
                        {website && (
                          <div className="flex items-center gap-2">
                            <LinkIcon size={16} />
                            <Link href={website} className="text-app">
                              {normalizeDomain(website)}
                            </Link>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            Joined {moment(createdAt).format('MMMM YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-3">
                      <Link
                        className="flex items-center gap-1 cursor-pointer hover:underline"
                        href={
                          !currentUser ? '#' : `/user/${username}/following`
                        }>
                        <span className="font-bold">
                          {following?.length ?? 0}
                        </span>
                        <span className="text-app-gray">Following</span>
                      </Link>
                      <Link
                        className="flex items-center gap-1 cursor-pointer hover:underline"
                        href={
                          !currentUser ? '#' : `/user/${username}/followers`
                        }>
                        <span className="font-bold">
                          {followers?.length ?? 0}
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
                <TabsList className="w-full grid grid-cols-3 bg-transparent">
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

            return (
              <PostPlaceholder
                tab={activeTab}
                isOwnProfile={currentUser?.username === username}
              />
            );
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
                isFrom="public"
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
                hideMenu={true}
                onLike={() => likePostMutation.mutate(post.data._id)}
                onBookmark={() => bookmarkPostMutation.mutate(post.data._id)}
              />
            );
          }

          return <PostSkeleton />;
        }}
      />

      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="capitalize">
                Report {username}
              </DialogTitle>
              <DialogDescription>
                Please provide details about why you're reporting this user. Our
                moderation team will review your report.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label
                htmlFor="reason"
                className="block text-sm font-medium mb-1">
                Reason for reporting:
              </label>
              <select
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded-md form-input">
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="misinformation">Misinformation</option>
                <option value="hate_speech">Hate speech</option>
                <option value="other">Other</option>
              </select>

              <label
                htmlFor="details"
                className="block text-sm font-medium mb-1">
                Details:
              </label>
              <Textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                id="details"
                placeholder="Please provide additional details..."
                className="min-h-[100px] form-input"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => handleReportUser(_id)}
                className="text-white bg-red-600 hover:bg-red-700  dark:bg-red-700 dark:hover:bg-red-600">
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};
