'use client';

import {PageHeader} from '@/components/app-headers';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import SearchBarList from '@/components/forms/list-search-bar';
import {UsersSkeleton} from '@/components/skeleton/users.skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {truncateText} from '@/lib/formatter';
import {cn} from '@/lib/utils';
import {userService} from '@/services/user-management';
import {UserProps} from '@/types/user.types';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {ArrowUp} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useDebounce} from 'use-debounce';

export const Users = () => {
  const lastScrollTop = useRef(0);
  const {currentUser, setUser} = useAuthStore(state => state);
  const [showGoUp, setShowGoUp] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const navigate = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });

  const [debouncedSearch] = useDebounce(searchTerm, 500);

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
    queryKey: ['get-all-users', debouncedSearch],
    queryFn: ({pageParam = 1}) =>
      userService.getAllUsers(pageParam, 10, debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
  });

  const users = useMemo(() => {
    return data?.pages?.flatMap(page => page.users) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('should query', error);

  console.log(data, 'should query dataa', totalCount);

  if (status === 'pending') {
    return (
      <UsersSkeleton
        header
        headerTitle="Connect"
        headerDesc="Discover people to follow"
      />
    );
  }

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
      <div className="hidden md:block">
        <PageHeader title="Connect" description="Discover people to follow" />
        <SearchBarList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <PageHeader title="Connect" description="Discover people to follow" />
        <SearchBarList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <Virtuoso
        className="custom-scrollbar min-h-screen divide-y divide-app-border"
        // style={{height: '100vh'}}
        data={users}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          EmptyPlaceholder: () =>
            status === 'error' ? null : (
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">No users found</h2>
                <p className="text-app-gray">
                  Check back later for more users to follow.
                </p>
              </div>
            ),
          Header: () => <div className="mt-27 md:mt-0"></div>,

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
        itemContent={(index, user) => {
          const isCurrentUser = currentUser?.username === user.username;

          const isFollowing = currentUser?.following?.includes(
            user._id?.toString(),
          );

          return (
            <div
              key={user._id}
              className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 cursor-pointer flex-1">
                <Avatar
                  className="cursor-pointer active:scale-90 transition-transform duration-150"
                  onClick={() => navigate.push(`/user/${user.username}`)}>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="capitalize text-app text-2xl">
                    {user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold capitalize">
                      {truncateText(user.username, 20)}
                    </h3>
                  </div>

                  {user.bio && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {user.bio.slice(0, 25)}
                      {user.bio.length > 25 && '...'}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-1 text-xs text-app-gray">
                    <span>{user.followers?.length || 0} followers</span>
                    <span>{user.following?.length || 0} following</span>
                  </div>
                </div>
              </div>
              {!isCurrentUser && (
                <Button
                  className={`rounded-full ml-3 active:scale-90 transition-transform duration-150 ${
                    isFollowing
                      ? 'bg-transparent text-black border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:text-white'
                      : 'bg-app text-white hover:bg-app/90'
                  }`}
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    handleFollowUser(user._id);
                  }}>
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
