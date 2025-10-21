'use client';

import {
  AdPerformanceCard,
  AdPerformancePlaceholder,
} from '@/components/ad/ad-performace-card';
import {PageHeader} from '@/components/app-headers';

import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import AdPerformanceCardSkeleton from '@/components/skeleton/adPerformance-card-skeleton';
import {Button} from '@/components/ui/button';
import {useInfiniteQuery} from '@tanstack/react-query';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {CSSProperties, ReactNode, useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

import {adService} from '@/services/ad-service';
import {AdPerformanceNav} from './components/ad-performance-nav';

type AdStatus =
  | 'pending'
  | 'approved'
  | 'paused'
  | 'rejected'
  | 'active'
  | 'expired';

const getStatusColor = (status: AdStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'expired':
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: AdStatus) => {
  switch (status) {
    case 'pending':
      return <Clock size={16} />;
    case 'paused':
      return <CheckCircle size={16} />;
    case 'rejected':
      return <AlertCircle size={16} />;
    case 'active':
      return <Activity size={16} />;
    case 'expired':
      return <AlertCircle size={16} />;
  }
};

type ListProps = {
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
};

type ItemProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const AdPerformancePage = () => {
  const navigate = useRouter();

  const [filteredStatus, setFilteredStatus] = useState<AdStatus | 'all'>('all');

  const [isLoading, setIsLoading] = useState(true);

  const [showGoUp, setShowGoUp] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  const lastScrollTop = useRef(0);

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
    queryKey: ['user-adPerformance-data', filteredStatus],
    queryFn: ({pageParam = 1}) =>
      adService.getUserAdByStatus(pageParam, 10, filteredStatus),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
  });

  const adData = useMemo(() => {
    return data?.pages?.flatMap(page => page.ads) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('user ad dataa', adData);

  const handleMakePayment = (adId: string) => {
    navigate.push(`/payment/${adId}`);
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

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
    <div className="">
      <PageHeader
        title="Ad Performance"
        description="Manage and track your advertisements"
        href="/home"
      />

      <AdPerformanceNav
        filteredStatus={filteredStatus}
        setFilteredStatus={setFilteredStatus}
      />

      <Virtuoso
        className="custom-scrollbar hide-scrollbar min-h-screen"
        ref={virtuosoRef}
        onScroll={handleScroll}
        totalCount={Math.ceil(adData.length / 2)} // each row has 2 cards
        components={{
          EmptyPlaceholder: () =>
            status === 'error' ? null : <AdPerformancePlaceholder />,

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
        itemContent={rowIndex => {
          const leftItem = adData[rowIndex * 2];
          const rightItem = adData[rowIndex * 2 + 1];

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 py-2">
              {/* LEFT CARD */}
              {status === 'pending' ? (
                <AdPerformanceCardSkeleton />
              ) : leftItem ? (
                <AdPerformanceCard ad={leftItem} key={leftItem._id} />
              ) : null}

              {/* RIGHT CARD */}
              {status === 'pending' ? (
                <AdPerformanceCardSkeleton />
              ) : rightItem ? (
                <AdPerformanceCard ad={rightItem} key={rightItem._id} />
              ) : null}
            </div>
          );
        }}
      />

      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixedBottomBtn z-1 fixed bottom-5 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}
      {adData?.length && (
        <div className="mt-10 mb-20 md:mb-5 text-center">
          <Button
            onClick={() => navigate.push('/advertise')}
            className="bg-app hover:bg-app/90 dark:bg-app-/90 dark:hover:bg-app text-white">
            Create New Advertisement <ArrowRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
