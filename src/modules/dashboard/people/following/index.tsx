'use client';

import {CustomPageHeader, PageHeader} from '@/components/app-headers';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import FollowersSkeleton from '@/components/skeleton/followers-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import {userService} from '@/services/user-management';
import {UserProps} from '@/types/user.types';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {ArrowUp} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

export const UserFollowingPage = () => {
  const {user} = useParams<{user: string}>();
  const {currentUser, setUser} = useAuthStore(state => state);
  const [showGoUp, setShowGoUp] = useState(false);
  const lastScrollTop = useRef(0);
  const [isPending, setIsPending] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const navigate = useRouter();
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });

  const shouldQuery = !!user;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['following', user],
    queryFn: ({pageParam = 1}) =>
      userService.getFollowingRequestAction(user, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
    enabled: shouldQuery,
  });

  console.log(shouldQuery, 'should query', error);

  console.log(data, 'should query dataa');

  const following = useMemo(() => {
    return data?.pages?.flatMap(page => page.following) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  const theUserId = data?.pages?.[0]?.pagination.userId;

  if (error?.message === 'User not found' || !user) {
    return <ErrorFeedback showGoBack message="User not found" />;
  }

  if (isLoading) {
    return <FollowersSkeleton />;
  }

  const isOwnProfile = user === currentUser?.username;
  const userId = theUserId;

  console.log(isOwnProfile, userId, 'isF-isOwn');

  const handleFollowUser = (id: string) => {
    setIsPending(true);
    mutate(id, {
      onSuccess(response, variables, context) {
        console.log(response, 'datameee');

        const {message, currentUserFollowings} = response.data;

        setUser({
          ...(currentUser as UserProps),
          following: currentUserFollowings,
        });
        toast.success(message);
      },

      onError(error: any, variables, context) {
        console.log(error, 'err');
        const {message} = error?.response?.data ?? {};
        toast.error(message);
      },
      onSettled(data, error, variables, context) {
        setIsPending(false);
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

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  return (
    <div>
      <div className="hidden lg:block">
        <PageHeader
          title="Following"
          description={user.charAt(0).toUpperCase() + user.slice(1)}
        />
      </div>

      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <CustomPageHeader
          title="Following"
          description={user.charAt(0).toUpperCase() + user.slice(1)}
        />
      </div>

      <Virtuoso
        className="custom-scrollbar min-h-screen divide-y divide-app-border"
        // style={{height: '100vh'}}
        data={following}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          EmptyPlaceholder: () =>
            status === 'error' ? null : (
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">
                  {isOwnProfile ? "You aren't" : "This user isn't"} following
                  anyone yet
                </h2>
                {isOwnProfile && (
                  <Button
                    className="mt-4 bg-app hover:bg-app/90"
                    onClick={() => navigate.push('/users')}>
                    Find people to follow
                  </Button>
                )}
              </div>
            ),

          Header: () => <div className="mt-18 lg:mt-0"></div>,
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
        itemContent={(index, following) => {
          if (!following) {
            return null;
          }
          const isCurrentUser = currentUser?.username === following.username;
          console.log({
            isCurrentUser,
            user,
            fol: following,
            id: following._id,
          });

          const isFollowing = currentUser?.following?.includes(
            following._id?.toString(),
          );

          return (
            <div
              key={following._id}
              className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Link href={`/user/${following.username}`}>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={following.avatar} />
                    <AvatarFallback>
                      {following.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold cursor-pointer capitalize">
                      {following.username}
                    </h3>
                  </div>
                </Link>
              </div>
              {!isCurrentUser && (
                <Button
                  onClick={() => handleFollowUser(following._id)}
                  disabled={isPending}
                  className={cn(
                    'rounded-full',
                    isFollowing
                      ? 'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black dark:text-white'
                      : 'bg-app text-white hover:bg-app/90',
                  )}
                  size="sm">
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}

              {isCurrentUser && (
                <Button
                  disabled={true}
                  className={cn(
                    'rounded-full',
                    'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black dark:text-white',
                  )}
                  size="sm">
                  You
                </Button>
              )}
            </div>
          );
        }}
      />

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
