'use client';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';

import {toast} from '@/components/ui/toast';
import {FC, Fragment, useMemo, useRef, useState} from 'react';

import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import PostSkeleton from '@/components/skeleton/post-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {queryClient} from '@/lib/client/query-client';
import {useReportActions} from '@/modules/dashboard/actions/action-hooks/report.action-hooks';

import {reportService} from '@/services/report-service';
import {useInfiniteQuery} from '@tanstack/react-query';
import {ArrowUp} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useDebounce} from 'use-debounce';

// Suspension period options
const suspensionPeriods = [
  {value: '1', label: '1 day'},
  {value: '3', label: '3 days'},
  {value: '7', label: '7 days'},
  {value: '14', label: '14 days'},
  {value: '30', label: '30 days'},
  {value: 'permanent', label: 'Permanent'},
];

type ReportsProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
};

export const ReportsTab: FC<ReportsProps> = ({searchTerm}) => {
  const navigate = useRouter();

  const [reportAction, setReportAction] = useState<
    'resolve' | 'warn' | 'suspend' | 'ban'
  >('resolve');
  const [reportActionDialog, setReportActionDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');

  const [reportActionReason, setReportActionReason] = useState('');
  const [viewContentDialog, setViewContentDialog] = useState(false);

  const [selectedReportContent, setSelectedReportContent] = useState<any>();
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [targetUser, setTargetUser] = useState('');
  const lastScrollTop = useRef(0);
  const [submitting, setSubmitting] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const {resolveReport, issueWarning} = useReportActions();
  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['admin-reports-content', debouncedSearch],
    queryFn: ({pageParam = 1}) =>
      reportService.getReports(pageParam, 10, debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
  });

  const reportsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.reports) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('report err', error);

  console.log(reportsData, 'admin reports dataa', totalCount);

  const handleOpenReportActionDialog = (
    reportId: string,
    action: 'resolve' | 'warn' | 'suspend' | 'ban',
  ) => {
    setSelectedReport(reportId);
    setReportAction(action);
    setReportActionReason('');
    setReportActionDialog(true);
  };

  const handleReportAction = () => {
    if (
      (reportAction === 'warn' ||
        reportAction === 'suspend' ||
        reportAction === 'ban') &&
      !reportActionReason
    ) {
      toast.error('Please provide a reason');
      return;
    }
    setSubmitting(true);

    if (reportAction === 'resolve') {
      resolveReport.mutate(selectedReport, {
        onSuccess(data, variables, context) {
          console.log(data);
          toast.success(`Report #${selectedReport} has been resolved`);
          setReportActionDialog(false);
          setSubmitting(false);
          queryClient.invalidateQueries({
            queryKey: ['admin-reports-content', debouncedSearch],
          });
        },
        onError(error, variables, context) {
          toast.success(
            `Something went wrong while resolving report #${selectedReport}`,
          );
          setSubmitting(false);
        },
      });
    } else if (reportAction === 'warn') {
      const data = {
        message: reportActionReason,
        userId: targetUser,
      };
      issueWarning.mutate(data, {
        onSuccess(data, variables, context) {
          console.log(data, 'warn success');
          toast.success(`Warning issued for report #${selectedReport}`);
          setReportActionDialog(false);
          setSubmitting(false);
          queryClient.invalidateQueries({queryKey: ['unreadCount']});
        },
        onError(error, variables, context) {
          console.log(error, 'errrrWarning');
          toast.success(
            `Something went wrong while issuing warning for report #${selectedReport}`,
          );
          setSubmitting(false);
        },
      });
    } else {
      toast.success(`Oops! Something is not right, please try again later`);
      setReportActionDialog(false);
      setSubmitting(false);
    }
  };

  const handleViewReportedContent = (report: any) => {
    setSelectedReportContent(
      report.type === 'post'
        ? report.post
        : report.type === 'comment'
        ? report.comment
        : report.type === 'ad'
        ? report.ad
        : report.type === 'user'
        ? report.user
        : report,
    );
    setSelectedReportType(report.type);
    setViewContentDialog(true);
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const getReportType = (type: string): string => {
    switch (type) {
      case 'post':
        return 'Post';
      case 'comment':
        return 'Comment';
      case 'ad':
        return 'Ad';
      case 'abuse':
        return 'Abuse';
      case 'user':
        return 'User';
      default:
        return 'Unknown';
    }
  };

  const getViewLabel = () => {
    switch (selectedReportType) {
      case 'post':
        return 'View Post';
      case 'comment':
        return 'View comment';
      case 'ad':
        return 'View ad';
      case 'user':
        return 'View user';
      default:
        return 'View';
    }
  };

  const handleReportView = () => {
    if (selectedReportType === 'user') {
      navigate.push(`/${selectedReportType}/${selectedReportContent.username}`);
      return;
    }
    navigate.push(`/${selectedReportType}/${selectedReportContent._id}`);
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
    <Fragment>
      <div className="space-y-4">
        <Virtuoso
          className="custom-scrollbar min-h-screen"
          data={reportsData}
          onScroll={handleScroll}
          ref={virtuosoRef}
          components={{
            Header: () => (
              <h2 className="text-lg font-bold mb-3">Reported Content</h2>
            ),
            EmptyPlaceholder: () =>
              status === 'error' ? null : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-app-gray">
                      No reports found matching your search
                    </p>
                  </CardContent>
                </Card>
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
              handleFetchNext();
            }
          }}
          itemContent={(index, report) => {
            console.log(report, 'riri');
            if (status === 'pending') {
              return <PostSkeleton />;
            } else {
              if (!report) {
                return (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-app-gray">No reports found</p>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <Card key={report._id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold">
                          {getReportType(report.type)} reported for:{' '}
                          {report.reason}
                        </h3>

                        <div className="flex flex-wrap gap-2 my-2">
                          <Badge variant="destructive">Reported</Badge>
                          <Badge
                            variant="outline"
                            className="border-app-border">
                            {report.type}
                          </Badge>
                        </div>

                        <p className="text-xs text-app-gray">
                          Reported by{' '}
                          <Link
                            href={`/user/${report.reportedBy.username}`}
                            className="font-medium capitalize text-blue-500">
                            {report.reportedBy.username}
                          </Link>{' '}
                          · {moment(report.createdAt).format('DD/MM/YYYY')}
                        </p>
                        {report.type !== 'ad' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => handleViewReportedContent(report)}>
                            View Content
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Button
                          size="sm"
                          className="bg-green-700 hover:bg-green-600"
                          onClick={() =>
                            handleOpenReportActionDialog(report._id, 'resolve')
                          }>
                          Resolve
                        </Button>
                        {report.type !== 'abuse' && (
                          <Button
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-500"
                            onClick={() => {
                              setTargetUser(
                                report.type === 'post'
                                  ? report.post.user
                                  : report.type === 'comment'
                                  ? report.comment.commentBy
                                  : report.type === 'ad'
                                  ? report.ad.postedBy
                                  : report.type === 'user'
                                  ? report.user._id
                                  : null,
                              );
                              handleOpenReportActionDialog(report._id, 'warn');
                            }}>
                            Warn User
                          </Button>
                        )}
                        {/* <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-500"
                          onClick={() =>
                            handleOpenReportActionDialog(report.id, 'suspend')
                          }>
                          Suspend User
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleOpenReportActionDialog(report._id, 'ban')
                          }>
                          Ban User
                        </Button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
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

      {/* Report Action Dialog */}
      <Dialog open={reportActionDialog} onOpenChange={setReportActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reportAction === 'resolve'
                ? 'Resolve Report'
                : reportAction === 'warn'
                ? 'Warn User'
                : reportAction === 'suspend'
                ? 'Suspend User'
                : 'Ban User'}
            </DialogTitle>
            <DialogDescription>
              {reportAction === 'resolve'
                ? 'You are about to resolve this report'
                : 'Please provide details for this action.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {reportAction !== 'resolve' && (
              <div className="space-y-2">
                <Label htmlFor="reason">Message to User</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter message to user"
                  value={reportActionReason}
                  onChange={e => setReportActionReason(e.target.value)}
                  className="form-input"
                />
              </div>
            )}

            {reportAction === 'suspend' && (
              <div className="space-y-2">
                <Label htmlFor="suspension-period">Suspension Period</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {suspensionPeriods.slice(0, -1).map(period => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportActionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={
                reportAction === 'resolve'
                  ? 'default'
                  : reportAction === 'warn'
                  ? 'outline'
                  : 'destructive'
              }
              onClick={handleReportAction}
              disabled={
                submitting ||
                (reportAction !== 'resolve' && !reportActionReason)
              }>
              {submitting ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <Dialog open={viewContentDialog} onOpenChange={setViewContentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="capitalize">
                {selectedReportType} reported
              </DialogTitle>
              <DialogDescription>
                {selectedReportType === 'user' && (
                  <>
                    <Avatar
                      className="w-10 h-10 cursor-pointer"
                      // onClick={navigateToUserProfile}
                    >
                      <AvatarImage
                        src={selectedReportContent.avatar ?? undefined}
                      />
                      <AvatarFallback className="capitalize text-app text-3xl">
                        {selectedReportContent.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <>{selectedReportContent.username}</>
                  </>
                )}
                {(selectedReportType === 'post' ||
                  selectedReportType === 'comment') && (
                  <>
                    {selectedReportContent?.content.length > 100
                      ? selectedReportContent?.content.slice(0, 100) + '...'
                      : selectedReportContent?.content}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            {selectedReportContent?.note && (
              <p>More Details: {selectedReportContent?.note}</p>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewContentDialog(false)}>
                Cancel
              </Button>
              {selectedReportType === 'abuse' ||
              selectedReportType === 'ad' ||
              selectedReportType === 'comment' ? (
                <></>
              ) : (
                <Button
                  className="bg-app text-white"
                  onClick={handleReportView}>
                  {getViewLabel()}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Fragment>
  );
};
