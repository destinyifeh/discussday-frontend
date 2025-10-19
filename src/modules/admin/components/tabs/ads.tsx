'use client';

import {FC, Fragment, useMemo, useRef, useState} from 'react';

import AdCard from '@/components/ad/ad-card';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import AdSkeleton from '@/components/skeleton/ad-skeleton';
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
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {queryClient} from '@/lib/client/query-client';
import {useInfiniteQuery} from '@tanstack/react-query';
import {ArrowUp, CheckCircle, XCircle} from 'lucide-react';
import moment from 'moment';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useDebounce} from 'use-debounce';
import {adminAdService} from '../../actions/ad-service/ad';
import {useAdminAdActions} from '../../actions/ad-service/ad-hooks';

type AdProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
};

export const AdTab: FC<AdProps> = ({
  searchTerm,
  filterSection,
  filterStatus,
}) => {
  const [activateAdDialog, setActivateAdDialog] = useState(false);
  const [previewAdDialog, setPreviewAdDialog] = useState(false);
  const [approveAdDialog, setApproveAdDialog] = useState(false);
  const [rejectAdDialog, setRejectAdDialog] = useState(false);
  const [pauseAdDialog, setPauseAdDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedAd, setSelectedAd] = useState<any>('');
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const lastScrollTop = useRef(0);
  const [submittingApproval, setSubmittingApproval] = useState(false);
  const [submittingActivation, setSubmittingActivation] = useState(false);
  const [submittingRejection, setSubmittingRejection] = useState(false);
  const [submittingPause, setSubmittingPause] = useState(false);
  const [submittingResume, setSubmittingResume] = useState(false);
  const [showGoUp, setShowGoUp] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const {
    approveAdRequest,
    rejectAdRequest,
    pauseAdRequest,
    activateAdRequest,
    resumeAdRequest,
  } = useAdminAdActions();
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
    queryKey: ['admin-ads', debouncedSearch],
    queryFn: ({pageParam = 1}) =>
      adminAdService.getAds(pageParam, 10, debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
  });

  const adData = useMemo(() => {
    return data?.pages?.flatMap(page => page.ads) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('report err', error);

  console.log(adData, 'admin ad dataa', totalCount);

  const handleRejectAd = () => {
    if (!rejectReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setSubmittingRejection(true);
    const data = {
      adId: selectedAd,
      ownerId: selectedOwner,
      reason: rejectReason,
    };

    rejectAdRequest.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'ad rejection');
        toast.success(`Advertisement #${selectedAd} has been rejected`);
        queryClient.invalidateQueries({
          queryKey: ['admin-ads', debouncedSearch],
        });
        queryClient.invalidateQueries({
          queryKey: ['unreadCount'],
        });
      },
      onError(error, variables, context) {
        console.log(error, 'ad rejection err');
        toast.error(
          'There was an issue rejecting this ad. Please try again in a few moments.',
        );
      },
      onSettled(data, error, variables, context) {
        setSubmittingRejection(false);
        setRejectAdDialog(false);
      },
    });
  };

  const handleOpenRejectAdDialog = (adId: string, ownerId: string) => {
    setSelectedAd(adId);
    setSelectedOwner(ownerId);
    setRejectReason('');
    setRejectAdDialog(true);
  };

  const handleOpenApproveAdDialog = (adId: string, ownerId: string) => {
    setSelectedAd(adId);
    setSelectedOwner(ownerId);
    setApproveAdDialog(true);
  };

  const handleOpenPreviewAdDialog = (ad: any) => {
    setSelectedAd(ad);
    setPreviewAdDialog(true);
  };

  const handlePauseAd = () => {
    if (!rejectReason) {
      toast.error('Please provide a reason for pausing');
      return;
    }

    setSubmittingPause(true);
    const data = {
      adId: selectedAd,
      ownerId: selectedOwner,
      reason: rejectReason,
    };

    pauseAdRequest.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'ad pause');
        toast.success(`Advertisement #${selectedAd} has been paused`);
        queryClient.invalidateQueries({
          queryKey: ['admin-ads', debouncedSearch],
        });
        queryClient.invalidateQueries({
          queryKey: ['unreadCount'],
        });
      },
      onError(error, variables, context) {
        console.log(error, 'ad pause err');
        toast.error(
          'There was an issue pausing this ad. Please try again in a few moments.',
        );
      },
      onSettled(data, error, variables, context) {
        setSubmittingPause(false);
        setPauseAdDialog(false);
      },
    });
  };

  const handleOpenPauseAdDialog = (adId: string, ownerId: string) => {
    setSelectedAd(adId);
    setSelectedOwner(ownerId);
    setRejectReason('');
    setPauseAdDialog(true);
  };

  const handleOpenActivateAdDialog = (adId: string, ownerId: string) => {
    setSelectedAd(adId);
    setSelectedOwner(ownerId);
    setActivateAdDialog(true);
  };

  const handleApproveAd = () => {
    setSubmittingApproval(true);
    const data = {
      ownerId: selectedOwner,
      adId: selectedAd,
    };
    approveAdRequest.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'ad approval');
        toast.success(`Advertisement #${selectedAd} has been approved`);
        queryClient.invalidateQueries({
          queryKey: ['admin-ads', debouncedSearch],
        });
        queryClient.invalidateQueries({
          queryKey: ['unreadCount'],
        });
      },
      onError(error, variables, context) {
        console.log(error, 'ad approval err');
        toast.error(
          'There was an issue approving this ad. Please try again in a few moments.',
        );
      },
      onSettled(data, error, variables, context) {
        setSubmittingApproval(false);
        setSubmittingPause(false);
        setApproveAdDialog(false);
      },
    });
  };

  const handleResumeAd = (adId: string, ownerId: string) => {
    setSelectedAd(adId);
    setSubmittingResume(true);
    const data = {
      ownerId,
      adId,
    };
    resumeAdRequest.mutate(adId, {
      onSuccess(data, variables, context) {
        console.log(data, 'ad resume');
        toast.success(`Advertisement #${adId} has been resumed`);
        queryClient.invalidateQueries({
          queryKey: ['admin-ads', debouncedSearch],
        });
        queryClient.invalidateQueries({
          queryKey: ['unreadCount'],
        });
      },
      onError(error, variables, context) {
        console.log(error, 'ad resume err');
        toast.error(
          'There was an issue resuming this ad. Please try again in a few moments.',
        );
      },
      onSettled(data, error, variables, context) {
        setSubmittingResume(false);
        setSubmittingPause(false);
      },
    });
  };

  const handleActivateAd = () => {
    setSubmittingActivation(true);

    const data = {
      ownerId: selectedOwner,
      adId: selectedAd,
    };
    activateAdRequest.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'ad activated');
        toast.success(`Advertisement #${selectedAd} has been activated`);
        queryClient.invalidateQueries({
          queryKey: ['admin-ads', debouncedSearch],
        });
        queryClient.invalidateQueries({
          queryKey: ['unreadCount'],
        });
      },
      onError(error, variables, context) {
        console.log(error, 'ad activate err');
        toast.error(
          'There was an issue activating this ad. Please try again in a few moments.',
        );
      },
      onSettled(data, error, variables, context) {
        setSubmittingActivation(false);
        setSubmittingPause(false);
        setActivateAdDialog(false);
      },
    });
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const getAdStatusDateLabel = (ad: any) => {
    switch (ad.status) {
      case 'paused':
        return `Paused · ${moment(ad.pausedDate).format('DD/MM/YYYY')}`;
      case 'rejected':
        return `Rejected · ${moment(ad.rejectedDate).format('DD/MM/YYYY')}`;
      case 'active':
        return `Activated · ${moment(ad.activatedDate).format('DD/MM/YYYY')}`;
      case 'approved':
        return `Approved · ${moment(ad.approvedDate).format('DD/MM/YYYY')}`;
      default:
        return `Submitted · ${moment(ad.createdAt).format('DD/MM/YYYY')}`;
    }
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
      <div className="">
        <Virtuoso
          className="custom-scrollbar"
          style={{height: '100vh'}}
          data={adData}
          onScroll={handleScroll}
          ref={virtuosoRef}
          components={{
            Header: () => (
              <h2 className="text-lg font-bold mb-3">Advertisements</h2>
            ),
            EmptyPlaceholder: () =>
              status === 'error' ? null : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-app-gray">No advertisements found</p>
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
          itemContent={(index, ad) => {
            if (status === 'pending') {
              return <AdSkeleton />;
            } else {
              if (!ad) {
                return null;
              }

              return (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold">{ad.title}</h3>
                        <p className="text-sm text-app-gray mb-2">
                          {ad.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">
                            {ad.type === 'banner'
                              ? 'Banner Ad'
                              : ad.type === 'sponsored'
                              ? 'Sponsored Post'
                              : 'Feed Ad'}
                          </Badge>
                          <Badge variant="outline">
                            Duration: {ad.duration} days
                          </Badge>
                          <Badge variant="outline">Plan: {ad.plan}</Badge>
                          <Badge variant="secondary">{ad.status}</Badge>
                        </div>

                        <p className="text-xs text-app-gray">
                          By{' '}
                          <span className="font-medium capitalize">
                            {ad.owner.username}
                          </span>{' '}
                          {getAdStatusDateLabel(ad)}
                        </p>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            handleOpenPreviewAdDialog(ad);
                          }}>
                          Preview Ad
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        {ad.status === 'active' && (
                          <Button
                            disabled={submittingPause}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() =>
                              handleOpenPauseAdDialog(ad._id, ad.owner._id)
                            }>
                            <CheckCircle size={16} className="mr-1" />
                            {submittingPause && selectedAd === ad._id
                              ? 'Pausing'
                              : 'Pause'}
                          </Button>
                        )}

                        {ad.status === 'approved' && (
                          <Button
                            disabled={submittingActivation}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() =>
                              handleOpenActivateAdDialog(ad._id, ad.owner._id)
                            }>
                            <CheckCircle size={16} className="mr-1" />
                            {submittingActivation && selectedAd === ad._id
                              ? 'Activating'
                              : 'Activate'}
                          </Button>
                        )}

                        {ad.status === 'paused' && (
                          <Button
                            disabled={submittingResume}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleResumeAd(ad._id, ad.owner._id)
                            }>
                            <CheckCircle size={16} className="mr-1" />
                            {submittingResume && selectedAd === ad._id
                              ? 'Resuming'
                              : 'Resume'}
                          </Button>
                        )}

                        {ad.status === 'rejected' && (
                          <Button
                            disabled={true}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700">
                            <XCircle size={16} className="mr-1" />
                            Rejected
                          </Button>
                        )}

                        {ad.status === 'pending' && (
                          <>
                            <Button
                              disabled={
                                submittingApproval || submittingRejection
                              }
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleOpenApproveAdDialog(ad._id, ad.owner._id)
                              }>
                              <CheckCircle size={16} className="mr-1" />
                              {submittingApproval && selectedAd === ad._id
                                ? 'Approving'
                                : ' Approve'}
                            </Button>

                            <Button
                              disabled={
                                submittingApproval || submittingRejection
                              }
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleOpenRejectAdDialog(ad._id, ad.owner._id)
                              }>
                              <XCircle size={16} className="mr-1" />{' '}
                              {submittingRejection && selectedAd === ad._id
                                ? 'Rejecting...'
                                : 'Reject'}
                            </Button>
                          </>
                        )}
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

      {/* Reject Ad Dialog */}
      <Dialog open={rejectAdDialog} onOpenChange={setRejectAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Advertisement</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this advertisement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for rejection</Label>
              <Textarea
                disabled={submittingRejection}
                id="reason"
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={submittingRejection}
              variant="outline"
              onClick={() => setRejectAdDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={submittingRejection || !rejectReason}
              onClick={handleRejectAd}>
              {submittingRejection ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Ad Dialog */}
      <Dialog open={approveAdDialog} onOpenChange={setApproveAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Advertisement</DialogTitle>
            <DialogDescription>
              Please are you sure you want to approve this advertisement?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              disabled={submittingApproval}
              variant="outline"
              onClick={() => setApproveAdDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={submittingApproval}
              onClick={handleApproveAd}>
              {submittingApproval ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Ad Dialog */}
      <Dialog open={activateAdDialog} onOpenChange={setActivateAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Advertisement</DialogTitle>
            <DialogDescription>
              Please are you sure you want to activate this advertisement?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              disabled={submittingApproval}
              variant="outline"
              onClick={() => setActivateAdDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={submittingApproval}
              onClick={handleActivateAd}>
              {submittingActivation ? 'Activating...' : 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause Ad Dialog */}

      <Dialog open={pauseAdDialog} onOpenChange={setPauseAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause Advertisement</DialogTitle>
            <DialogDescription>
              Please provide a reason for pausing this advertisement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Pausing</Label>
              <Textarea
                disabled={submittingRejection}
                id="reason"
                placeholder="Enter reason for pausing"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={submittingPause}
              variant="outline"
              onClick={() => setPauseAdDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={submittingPause}
              onClick={handlePauseAd}>
              {submittingRejection ? 'Pausing...' : 'Pause'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Ad Dialog */}

      <Dialog open={previewAdDialog} onOpenChange={setPreviewAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Advertisement</DialogTitle>
            <DialogDescription>
              You are previewing the ad titled "{selectedAd?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AdCard ad={selectedAd} />
          </div>
          <DialogFooter>
            <Button
              disabled={submittingPause}
              variant="outline"
              onClick={() => setPreviewAdDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
