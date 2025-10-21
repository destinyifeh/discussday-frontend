'use client';

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
import {ArrowUp, CheckCircle, Edit, XCircle} from 'lucide-react';

import {toast} from '@/components/ui/toast';
import {FC, Fragment, useMemo, useRef, useState} from 'react';

import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {MobileBottomTab} from '@/components/layouts/dashboard/mobile-bottom-tab';
import PostSkeleton from '@/components/skeleton/post-skeleton';
import {Textarea} from '@/components/ui/textarea';
import {queryClient} from '@/lib/client/query-client';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useDebounce} from 'use-debounce';

import {adminService} from '@/services/admin-service';
import {useAdminPostActions} from '../../actions/post-service/post-hooks';

type ContentProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
};

export const ContentTab: FC<ContentProps> = ({
  searchTerm,

  filterSection,
  filterStatus,
}) => {
  const navigate = useRouter();
  const lastScrollTop = useRef(0);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [demoting, setDemoting] = useState(false);
  const [showGoUp, setShowGoUp] = useState(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [contentActionDialog, setContentActionDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [commentStatus, setCommentStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thePost, setThePost] = useState<any>();
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const [contentAction, setContentAction] = useState<
    'delete' | 'edit' | 'close'
  >('close');
  const [contentActionReason, setContentActionReason] = useState('');

  const [viewContentDialog, setViewContentDialog] = useState(false);

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const {closePostCommentRequest, deletePostRequest, promotePost, demotePost} =
    useAdminPostActions();
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
    queryKey: ['admin-posts-content-with-comment-count', debouncedSearch],
    queryFn: ({pageParam = 1}) =>
      adminService.getPostsContent(pageParam, 10, debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
  });

  const postsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('should query', error);

  console.log(postsData, 'admin content dataa', totalCount);

  const handleOpenContentActionDialog = (
    contentId: string,
    action: 'delete' | 'edit' | 'close',
    commentsClosed?: boolean,
    post?: any,
  ) => {
    setSelectedContent(contentId);
    setContentAction(action);
    setContentActionReason('');
    setContentActionDialog(true);
    setCommentStatus(commentsClosed as boolean);
    setThePost(post);
  };

  const handleContentAction = () => {
    if (!contentActionReason) {
      toast.error('Please provide a reason');
      return;
    }
    setIsLoading(true);
    if (contentAction === 'delete') {
      deletePostRequest.mutate(selectedContent, {
        onSuccess(data, variables, context) {
          console.log(data, 'delete post data');
          setIsLoading(false);
          toast.success(`Content #${selectedContent} has been deleted`);
          //toast.success(data.message);
          queryClient.invalidateQueries({
            queryKey: [
              'admin-posts-content-with-comment-count',
              debouncedSearch,
            ],
          });
          setContentActionDialog(false);
        },
        onError(error: any, variables, context) {
          console.log(error, 'comment close err');
          toast.error(
            error?.response?.data?.message ?? 'Oops! Something went wrong.',
          );
          setIsLoading(false);
          setContentActionDialog(false);
        },
      });
    } else if (contentAction === 'edit') {
      setContentActionDialog(false);

      navigate.push(
        `/discuss/${thePost.section.toLowerCase()}/${thePost.slugId}/${
          thePost.slug
        }/edit`,
      );
    } else {
      closePostCommentRequest.mutate(selectedContent, {
        onSuccess(data, variables, context) {
          console.log(data, 'comment close data');
          setIsLoading(false);
          toast.success(data.message);
          queryClient.invalidateQueries({
            queryKey: [
              'admin-posts-content-with-comment-count',
              debouncedSearch,
            ],
          });
          setContentActionDialog(false);
        },
        onError(error: any, variables, context) {
          console.log(error, 'comment close err');
          toast.error(
            error?.response?.data?.message ?? 'Oops! Something went wrong.',
          );
          setIsLoading(false);
          setContentActionDialog(false);
        },
      });
    }
  };

  const handlePromotePost = (id: string) => {
    setPromoting(true);
    promotePost.mutate(id, {
      onSuccess(data, variables, context) {
        toast.success('Post successfully promoted to the frontpage');
        queryClient.invalidateQueries({
          queryKey: ['admin-posts-content-with-comment-count', debouncedSearch],
        });
      },
      onError(error, variables, context) {
        toast.error('Something went wrong. Please try again later.');
      },
      onSettled(data, error, variables, context) {
        setPromoting(false);
      },
    });
  };

  const handleDemotePost = (id: string) => {
    setDemoting(true);
    demotePost.mutate(id, {
      onSuccess(data, variables, context) {
        toast.success('Post has been removed from the frontpage');
        queryClient.invalidateQueries({
          queryKey: ['admin-posts-content-with-comment-count', debouncedSearch],
        });
      },
      onError(error, variables, context) {
        toast.error('Something went wrong. Please try again later.');
      },
      onSettled(data, error, variables, context) {
        setDemoting(false);
      },
    });
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
    <Fragment>
      <div className="space-y-4">
        <Virtuoso
          className="custom-scrollbar min-h-screen"
          data={postsData}
          onScroll={handleScroll}
          ref={virtuosoRef}
          components={{
            Header: () => <h2 className="text-lg font-bold">All Content</h2>,
            EmptyPlaceholder: () =>
              status === 'error' ? null : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-app-gray">
                      No posts found matching your search
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
          itemContent={(index, post) => {
            if (status === 'pending') {
              return <PostSkeleton />;
            } else {
              if (!post) {
                return null;
              }

              return (
                <div
                  key={post._id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                  <div className="font-medium truncate">{post.title}</div>
                  <div>By {post?.user.username}</div>
                  <div>
                    <div>{post.commentCount || 0} comments</div>

                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        (post.status || 'published') === 'promoted'
                          ? 'bg-green-100 text-green-800'
                          : (post.status || 'published') === 'published'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {post.status || 'published'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate.push(
                          `/discuss/${post.section.toLowerCase()}/${
                            post.slugId
                          }/${post.slug}`,
                        )
                      }>
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500"
                      onClick={() =>
                        handleOpenContentActionDialog(
                          post._id,
                          'edit',
                          post.commentsClosed,
                          post,
                        )
                      }>
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500"
                      onClick={() =>
                        handleOpenContentActionDialog(
                          post._id,
                          'close',
                          post.commentsClosed,
                          post,
                        )
                      }>
                      {post.commentsClosed === false
                        ? 'Lock Comments '
                        : 'Unlock Comments'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() =>
                        handleOpenContentActionDialog(post._id, 'delete')
                      }>
                      Delete
                    </Button>
                    {post.status === 'published' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={promoting}
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => handlePromotePost(post._id)}>
                        <CheckCircle size={14} className="mr-1" />{' '}
                        {promoting ? 'Promoting' : 'Promote'}
                      </Button>
                    )}
                    {post.status === 'promoted' && (
                      <Button
                        disabled={demoting}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDemotePost(post._id)}>
                        <XCircle size={14} className="mr-1" />
                        {demoting ? 'Demoting' : 'Demote'}
                      </Button>
                    )}
                  </div>
                </div>
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

        {showBottomTab && <MobileBottomTab />}
      </div>

      {/* Content Action Dialog */}
      <Dialog open={contentActionDialog} onOpenChange={setContentActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contentAction === 'delete'
                ? 'Delete Content'
                : contentAction === 'edit'
                ? 'Edit Content'
                : commentStatus === false
                ? 'Lock Comments'
                : 'Unlock Comments'}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason"
                value={contentActionReason}
                onChange={e => setContentActionReason(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => setContentActionDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={contentAction === 'delete' ? 'destructive' : 'default'}
              onClick={handleContentAction}>
              {isLoading ? 'Confirming...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
