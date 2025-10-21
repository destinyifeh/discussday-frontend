'use client';

import {PageHeader} from '@/components/app-headers';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {
  NotificationCard,
  NotificationPlaceholder,
} from '@/components/notication/notification-card';
import NotificationSkeleton from '@/components/skeleton/notification-skeleton';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {queryClient} from '@/lib/client/query-client';
import {notificationService} from '@/services/notification-service';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {ArrowUp} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useRouter();
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const [showGoUp, setShowGoUp] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const {
    mutate: markAllAsRead,
    isSuccess,
    isError,
    error: markError,
  } = useMutation({
    mutationFn: notificationService.markAllAsReadRequestAction,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications', activeTab]});
      queryClient.invalidateQueries({queryKey: ['unreadCount']});
    },
  });

  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['notifications', activeTab],
    queryFn: ({pageParam = 1}) =>
      notificationService.getNotificationsRequestAction(
        pageParam,
        10,
        activeTab,
      ),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
  });
  console.log('note err', error);

  const notificationsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.notifications) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log(notificationsData, 'note dataa', totalCount);

  useEffect(() => {
    if (notificationsData?.some((n: any) => !n.read)) {
      markAllAsRead();
      console.log('mark err', markError, isSuccess);
    }
  }, [notificationsData]);

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  const hasUnread = notificationsData.some(notification => !notification.read);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
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
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        data={notificationsData}
        totalCount={totalCount}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <Fragment>
              <div className=" flex justify-between items-center ">
                <PageHeader title="Notifications" />
                {hasUnread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead()}>
                    Mark all as read
                  </Button>
                )}
              </div>

              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full mb-7">
                <TabsList className="w-full grid grid-cols-2 bg-transparent">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentions"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Mentions
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Fragment>
          ),
          EmptyPlaceholder: () =>
            status === 'error' ? null : (
              <NotificationPlaceholder tab={activeTab} />
            ),

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
            fetchNextPage();
          }
        }}
        itemContent={(index, notification) => {
          console.log(notification, 'nifht');
          if (status === 'pending') {
            return <NotificationSkeleton />;
          }
          if (!notification) {
            return null;
          }
          return (
            <NotificationCard
              notification={notification}
              key={notification._id}
            />
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
