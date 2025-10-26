'use client';

import React, {Fragment, useCallback, useMemo, useRef, useState} from 'react';

import AdCard from '@/components/ad/ad-card';
import {PageHeader} from '@/components/app-headers';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {AddCommentField} from '@/components/post/add-comment-field';
import CommentCard from '@/components/post/comment-card';
import CommunityGuidelines from '@/components/post/community-guidelines';
import PostCard from '@/components/post/post-card';
import {PostContent2} from '@/components/post/post-content';
import {CommentPlaceholder} from '@/components/post/post-list';
import {RelatedPosts} from '@/components/post/related-posts';
import CommentSkeleton from '@/components/skeleton/comment-skeleton';
import PostDetailSkeleton from '@/components/skeleton/post-detail-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {queryClient} from '@/lib/client/query-client';
import {commentService} from '@/services/comment-service';
import {
  CommentFeedProps,
  CommentProps,
  ImageProps,
} from '@/types/post-item.type';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {ImagePlus, LockIcon, MessageSquare, Reply, Send, X} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMediaQuery} from 'react-responsive';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

import {postService} from '@/services/post-service';
import {CommentDto, UpdateCommentDto} from '../dto/post-dto';
import {usePostActions} from '../post-hooks';
import {MobileCommentSection} from './components/mobile-comment-section';
import {WebCommentSection} from './components/web-comment-section';

type PostDetailPageProps = {
  params: {
    section: string;
    slugId: string;
    slug: string;
  };
};

export const PostDetailPage = ({params}: PostDetailPageProps) => {
  const lastScrollTop = useRef(0);
  const {currentUser} = useAuthStore(state => state);
  const {theme} = useGlobalStore(state => state);
  const [showMobileNav, setShowMobileNav] = useState(true);
  //  const {slug} = useParams<{slug: string}>();
  //  const {slugId} = useParams<{slugId: string}>();
  const {slug, slugId} = params;
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const navigate = useRouter();
  const isMobile = useMediaQuery({maxWidth: 767});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteContent, setQuoteContent] = useState('');
  const [quotedImages, setQuotedImages] = useState<string[]>([]);
  const [quotedUser, setQuotedUser] = useState('');
  const [showWebComment, setShowWebComment] = useState(false);
  const [showMobileComment, setShowMobileComment] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]); // Track removed public_ids
  const [originalImages, setOriginalImages] = useState<ImageProps[]>([]);
  const [editComment, setEditComment] = useState<CommentFeedProps | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const [quotedUserId, setQuotedUserId] = useState('');
  const [quotedUserImage, setQuotedUserImage] = useState('');
  const [quotedContentCreatedDate, setQuotedContentCreatedDate] = useState('');
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const {createComment, updateCommentRequest} = usePostActions();
  console.log(slugId, 'slugId', slug);
  const shouldQuery = !!slugId;
  const {
    isLoading,
    error,
    data: post,
    status: postStatus,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['post-details', slugId],
    queryFn: () => postService.getViewPostBySlugIdRequestAction(slugId),
    retry: 1,
    enabled: shouldQuery,
  });
  console.log(shouldQuery, 'should query', error);

  console.log(post, 'should query dataa');

  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error: commentErr,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['comment-feed-posts', post?._id],
    queryFn: ({pageParam = 1}) =>
      commentService.getCommentFeeds(post?._id, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    enabled: !!post?._id,
    // refetchInterval: 5000,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });

  const commentsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.comments) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('get comment error', commentErr);

  console.log(commentsData, 'comments dataa', totalCount);

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({queryKey: ['post-details', slugId]});

      const previousPost = queryClient.getQueryData(['post-details', slugId]);

      queryClient.setQueryData(['post-details', slugId], (oldData: any) => {
        if (!oldData) return previousPost;
        const userId = currentUser?._id;
        const hasLiked = oldData.likedBy.includes(userId);
        const newLikedBy = hasLiked
          ? oldData.likedBy.filter((id: string) => id !== userId)
          : [...oldData.likedBy, userId];

        return {...oldData, likedBy: newLikedBy};
      });

      return {previousPost};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(['post-details', slugId], context.previousPost);
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: (data, err, postId) => {
      queryClient.invalidateQueries({
        queryKey: ['post-details', slugId],
      });
    },
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({queryKey: ['post-details', slugId]});

      const previousPost = queryClient.getQueryData(['post-details', slugId]);

      queryClient.setQueryData(['post-details', slugId], (oldData: any) => {
        if (!oldData) return previousPost;
        const userId = currentUser?._id;
        const hasBookedmarked = oldData.bookmarkedBy.includes(userId);
        const newBookedmarkedBy = hasBookedmarked
          ? oldData.bookmarkedBy.filter((id: string) => id !== userId)
          : [...oldData.bookmarkedBy, userId];

        return {...oldData, bookmarkedBy: newBookedmarkedBy};
      });

      return {previousPost};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(['post-details', slugId], context.previousPost);
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: (data, err, postId) => {
      queryClient.invalidateQueries({
        queryKey: ['post-details', slugId],
      });
    },
  });

  //comment liking
  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      commentService.likeCommentRequestAction(commentId),

    onMutate: async (commentId: any) => {
      await queryClient.cancelQueries({
        queryKey: ['comment-feed-posts', post?._id],
      });

      const previousData = queryClient.getQueryData([
        'comment-feed-posts',
        post?._id,
      ]);

      queryClient.setQueryData(
        ['comment-feed-posts', post?._id],
        (oldData: any) => {
          if (!oldData) return previousData;

          const userId = currentUser?._id;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              comments: page.comments.map((comment: any) => {
                if (comment._type !== 'post') return comment;
                if (comment.data._id !== commentId) return comment;

                // ✅ mutual exclusivity logic
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
        ['comment-feed-posts', post?._id],
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
        queryKey: ['comment-feed-posts', post?._id],
      });

      const previousData = queryClient.getQueryData([
        'comment-feed-posts',
        post?._id,
      ]);

      queryClient.setQueryData(
        ['comment-feed-posts', post?._id],
        (oldData: any) => {
          if (!oldData) return previousData;

          const userId = currentUser?._id;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              comments: page.comments.map((comment: any) => {
                if (comment._type !== 'post') return comment;
                if (comment.data._id !== commentId) return comment;

                // ✅ mutual exclusivity logic
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
        ['comment-feed-posts', post?._id],
        context.previousComments,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  const addComment = (data: CommentDto) => {
    console.log(data, 'dataa');
    setIsSubmitting(true);
    createComment.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'comment data');
        queryClient.invalidateQueries({
          queryKey: ['comment-feed-posts', post._id],
        });
        queryClient.invalidateQueries({
          queryKey: ['unreadCount'],
        });

        queryClient.invalidateQueries({
          queryKey: ['post-details', slugId],
        });
        // Clear input and close comment section if open on mobile
        setComment('');
        setQuoteContent('');
        setQuotedUser('');
        setImagePreview(null);
        setShowWebComment(false);
        setImageUrls([]);
        setImages([]);
        setShowMobileComment(false);
        setQuotedImages([]);
        toast.success('Comment added successfully');
      },
      onError(error, variables, context) {
        console.log(error, 'comment post err');

        toast.error(
          error.message ?? 'Failed to add comment. Please try again.',
        );
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const updateComment = (data: UpdateCommentDto) => {
    console.log(data, 'dataa');
    setIsSubmitting(true);
    updateCommentRequest.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'update comment data');
        queryClient.invalidateQueries({
          queryKey: ['comment-feed-posts', post._id],
        });
        // Clear input and close comment section if open on mobile
        setComment('');
        setQuoteContent('');
        setQuotedUser('');
        setImagePreview(null);
        setShowWebComment(false);
        setImageUrls([]);
        setImages([]);
        setIsEditing(false);
        setEditComment(null);
        setShowMobileComment(false);
        setQuotedImages([]);
        toast.success('Comment updated successfully');
      },
      onError(error, variables, context) {
        console.log(error, 'comment update err');

        toast.error(
          error.message ?? 'Failed to update comment. Please try again.',
        );
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const handleEditComment = useCallback(
    (comment: CommentFeedProps) => {
      console.log(comment, 'cocooid');

      if (comment) {
        if (comment.quotedComment) {
          console.log(comment.quotedComment, 'quotedCom');
          const quotedImg = comment.quotedComment.quotedImage
            ? comment.quotedComment.quotedImage.map((url: string) => url)
            : [];

          setQuotedUser(comment.quotedComment.quotedUser);
          setQuoteContent(comment.quotedComment.quotedContent);
          setQuoteId(comment.quotedComment.quotedId);
          setQuotedUserImage(comment.quotedComment.quotedUserImage as string);
          setQuotedImages(quotedImg);
          setQuotedContentCreatedDate(
            comment.quotedComment.quotedContentCreatedDate as string,
          );
          setComment(comment.content);
          setShowMobileComment(true);
          setShowWebComment(true);
          setIsEditing(true);
          setEditComment(comment);
          const originals = comment.images || [];
          setOriginalImages(originals);
          setImageUrls(originals.map((img: any) => img.secure_url));

          return;
        }
        setComment(comment.content);
        setShowMobileComment(true);
        setShowWebComment(true);
        setEditComment(comment);
        setIsEditing(true);
        const originals = comment.images || [];
        setOriginalImages(originals);
        setImageUrls(originals.map((img: any) => img.secure_url));
      }
    },
    [comments, setComment, setShowMobileComment, setShowWebComment],
  );

  const handleQuoteComment = useCallback(
    (comment: CommentFeedProps) => {
      console.log(comment, 'cocooid');
      const commentToQuote = comment;
      console.log(commentToQuote, 'heeeree');
      if (commentToQuote) {
        setQuoteContent(commentToQuote.content);
        setQuotedUser(commentToQuote.commentBy.username);
        setQuotedUserImage(commentToQuote.commentBy.avatar as string);
        setQuotedUserId(commentToQuote.commentBy._id);
        setQuoteId(commentToQuote._id);
        setQuotedContentCreatedDate(commentToQuote.createdAt as string);
        setShowMobileComment(true);
        setShowWebComment(true);
        setShowMobileComment(true);
        const originals = comment.images || [];
        console.log(originals, 'ooriiih');
        setOriginalImages(originals);
        setQuotedImages(originals.map((img: any) => img.secure_url));
      }
    },
    [
      comments,
      setQuoteContent,
      setQuotedUser,
      setShowMobileComment,
      setShowWebComment,
      setQuotedImages,
      setQuotedUserId,
      setQuoteId,
      setQuotedUserImage,
      setQuotedContentCreatedDate,
    ],
  );

  const handleSubmitComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!comment.trim() && !imagePreview) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      let quotePayload = null;
      if (quoteContent) {
        quotePayload = {
          quotedContent: quoteContent,
          quotedImage: quotedImages,
          quotedUser: quotedUser,
          quotedId: quoteId,
          quotedUserId: quotedUserId,
          quotedUserImage: quotedUserImage,
          quotedContentCreatedDate: quotedContentCreatedDate,
        };
      }

      if (isEditing) {
        updateComment({
          postId: post._id,
          content: comment.trim(),
          images: images,
          commentId: editComment?._id as string,
          removedImageIds: removedImageIds,
        });
        return;
      }

      addComment({
        postId: post._id,
        content: comment.trim(),
        images: images,
        quotedComment: quotePayload,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imageUrls.length + files.length > 2) {
      toast.info('You can only upload a maximum of 2 images');
      return;
    }

    Array.from(files).forEach(file => {
      // Create a blob URL for the image
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl, 'imagerrrr');
      setImages(prev => [...prev, file]);
      setImageUrls(prev => [...prev, imageUrl]);
    });
  };

  const removeImage = (index: number) => {
    console.log(index, 'remove imageee');
    const urlToRemove = imageUrls[index];

    // If the removed image is from the original post
    const original = originalImages.find(img => img.secure_url === urlToRemove);
    if (original) {
      setRemovedImageIds(prev => [...prev, original.public_id]);
      setOriginalImages(prev =>
        prev.filter(img => img.secure_url !== urlToRemove),
      );
    } else {
      // Removing a newly uploaded image
      setImages(prev =>
        prev.filter((_, i) => i !== index - originalImages.length),
      );
    }

    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  const allowInlineCom = false;

  const handleQuoteClick = (quotedCommentId: string) => {
    // 1. Find the index of the first comment by the quotedUsername
    console.log(quotedCommentId, 'tarrr22');
    const targetIndex = commentsData.findIndex(
      (c: any) => c.data._id === quotedCommentId,
    );
    console.log(targetIndex, 'tarrr');
    if (targetIndex !== -1) {
      // 2. Use Virtuoso's scrollToIndex method
      virtuosoRef.current?.scrollToIndex({
        index: targetIndex,
        align: 'center', // 'start', 'center', 'end'
        behavior: 'smooth',
      });

      // // 3. Add highlight effect
      // setHighlightedUsername(quotedUsername); // Set state to trigger highlight in rendering
      // setTimeout(() => {
      //   setHighlightedUsername(null); // Remove highlight after a delay
      // }, 2000);
    } else {
      console.log(`Comment by user "${quotedCommentId}" not found.`);
    }
  };

  const onComment = () => {
    navigate.push(`/login`);
  };

  const getButtonLabel = () => {
    if (isEditing) {
      return isSubmitting ? 'Updating...' : 'Update';
    }
    return isSubmitting ? 'Replying...' : 'Reply';
  };

  const allowMainCom = false;
  const mob = true;

  if (error?.message === 'Post not found' || !slugId || !slug) {
    return (
      <ErrorFeedback
        showGoBack
        showRetry
        onRetry={refetchPost}
        message="Post not found"
      />
    );
  }

  if (postStatus === 'error') {
    return (
      <ErrorFeedback
        showRetry
        onRetry={refetchPost}
        message="We encountered an unexpected error. Please try again"
        variant="minimal"
      />
    );
  }

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
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

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  return (
    <Fragment>
      <PageHeader title="Discuss" />
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        ref={virtuosoRef}
        onScroll={handleScroll}
        data={commentsData}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        }}
        computeItemKey={(index, comment) =>
          comment._type === 'ad'
            ? `ad-${comment.data._id}`
            : `comment-${comment.data._id}`
        }
        itemContent={(index, comment) => {
          if (status === 'pending') {
            return <CommentSkeleton />;
          } else {
            if (!comment || !comment.data) {
              return null;
            }
            if (comment._type === 'ad') {
              return <AdCard ad={comment.data} />;
            }
            return (
              <CommentCard
                comment={comment.data}
                onQuote={() => handleQuoteComment(comment.data)}
                handleQuoteClick={handleQuoteClick}
                onEdit={() => handleEditComment(comment.data)}
                onLike={() => likeCommentMutation.mutate(comment.data._id)}
                onDisLike={() =>
                  dislikeCommentMutation.mutate(comment.data._id)
                }
              />
            );
          }
        }}
        components={{
          Footer: () => {
            if (status === 'error') {
              return (
                <ErrorFeedback
                  showRetry
                  onRetry={refetch}
                  message="We encountered an unexpected error. Please try again"
                  variant="minimal"
                />
              );
            }

            if (isFetchingNextPage) {
              return <LoadingMore />;
            }

            if (fetchNextError) {
              return (
                <LoadMoreError
                  fetchNextError={fetchNextError}
                  handleFetchNext={handleFetchNext}
                />
              );
            }

            // Show RelatedPosts only when there are no more pages
            if (!hasNextPage) {
              return (
                <div className="p-4 border-t border-app-border mt-6">
                  <h2 className="text-lg font-bold mb-3">More Discussions</h2>
                  <RelatedPosts postId={post._id} />
                </div>
              );
            }

            return null;
          },

          Header: () => (
            <div className="">
              {/* <div className="pb-2 border-b border-app-border"> */}
              <div className="pb-2">
                <PostCard
                  post={post}
                  showActions={true}
                  isInDetailView={true}
                  onLike={() => likePostMutation.mutate(post._id)}
                  onBookmark={() => bookmarkPostMutation.mutate(post._id)}
                />
              </div>

              {/* All replies header with add comment button for web */}
              <div className="px-4 py-3 border-b flex justify-between items-center border-app-border">
                <h2 className="font-bold text-lg">All replies</h2>
              </div>

              {post?.commentsClosed && (
                <div className="text-sm text-gray-600 flex items-center gap-2 justify-center my-3">
                  <LockIcon className="w-4 h-4 text-gray-500" />
                  This discussion has been locked. No new comments can be added.
                </div>
              )}

              {/* Web view comment input area */}
              {allowInlineCom && (
                <div className="hidden md:block px-4 py-4 border-b border-app-border">
                  <CommunityGuidelines />
                  <form
                    onSubmit={handleSubmitComment}
                    className="mt-4 space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser?.avatar ?? undefined} />
                        <AvatarFallback className="capitalize text-app text-3xl">
                          {currentUser?.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        {quotedUser && (
                          <div className="bg-gray-100 p-3 rounded-md mb-3 border-l-4 border-app flex flex-row justify-between">
                            <div>
                              <div className="font-semibold mb-1 text-app">
                                @{quotedUser}
                              </div>
                              <div className="text-gray-700">
                                {quoteContent.replace(/^>\s[\w]+:\s/gm, '')}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setQuoteContent('');
                                setQuotedUser('');
                                setComment('');
                                setImagePreview(null);
                              }}>
                              <X />
                            </Button>
                          </div>
                        )}

                        <Textarea
                          placeholder="Add your comment..."
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          className="min-h-[120px] resize-none form-input"
                          autoFocus
                        />

                        {imagePreview && (
                          <div className="relative mt-3 rounded-md overflow-hidden border border-gray-200">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full max-h-60 object-contain"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              //onClick={removeImage}
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                              <X size={16} />
                            </Button>
                          </div>
                        )}

                        <div className="mt-3 flex justify-end items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            ref={fileInputRef}
                            id="image-upload"
                          />
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-app"
                              onClick={() => fileInputRef.current?.click()}>
                              <ImagePlus size={18} />
                            </Button>
                            <Button
                              type="submit"
                              className="bg-app hover:bg-app/90"
                              disabled={
                                isSubmitting ||
                                (!comment.trim() && !imagePreview)
                              }>
                              <Send size={16} className="mr-2" />
                              Post Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ),

          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <CommentSkeleton />;
            }

            return <CommentPlaceholder />;
          },
        }}
      />

      {!post?.commentsClosed && (
        <>
          {/* Mobile comment section - slides up from bottom */}
          {!currentUser ? (
            <>
              <Button
                className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-app hover:bg-app/90 text-white"
                size="icon"
                onClick={onComment}>
                {/* <MessageSquare size={24} /> */}
                Login
              </Button>

              <Button
                className="hidden lg:block fixedBottomBtn max-w-3xl mx-auto fixed bottom-6 right-[26%] h-14 w-14 rounded-full shadow-lg z-1 bg-app hover:bg-app/90 dark:hover:bg-app dark:bg-app/90 text-white"
                size="icon"
                onClick={() => {
                  setShowWebComment(!showWebComment);
                  virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
                }}>
                Login
              </Button>
            </>
          ) : (
            <>
              <MobileCommentSection
                showMobileComment={showMobileComment}
                setShowMobileComment={setShowMobileComment}
                setQuoteContent={setQuoteContent}
                setQuotedUser={setQuotedUser}
                imagePreview={imagePreview}
                isSubmitting={isSubmitting}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                imageUrls={imageUrls}
                setComment={setComment}
                setImagePreview={setImagePreview}
                quoteContent={quoteContent}
                quotedUser={quotedUser}
                comment={comment}
                virtuosoRef={virtuosoRef}
                fileInputRef={fileInputRef}
                handleSubmitComment={handleSubmitComment}
                setEditComment={setEditComment}
                setIsEditing={setIsEditing}
                setImageUrls={setImageUrls}
                setImages={setImages}
                isEditing={isEditing}
                getButtonLabel={getButtonLabel}
                quotedImages={quotedImages}
                setQuotedImages={setQuotedImages}
                quotedUserImage={quotedUserImage}
                quotedContentCreatedDate={quotedContentCreatedDate}
              />
              <WebCommentSection
                showWebComment={showWebComment}
                setShowWebComment={setShowWebComment}
                setQuoteContent={setQuoteContent}
                setQuotedUser={setQuotedUser}
                imagePreview={imagePreview}
                isSubmitting={isSubmitting}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                imageUrls={imageUrls}
                setComment={setComment}
                setImagePreview={setImagePreview}
                quoteContent={quoteContent}
                quotedUser={quotedUser}
                comment={comment}
                virtuosoRef={virtuosoRef}
                fileInputRef={fileInputRef}
                handleSubmitComment={handleSubmitComment}
                setEditComment={setEditComment}
                setIsEditing={setIsEditing}
                setImageUrls={setImageUrls}
                setImages={setImages}
                isEditing={isEditing}
                getButtonLabel={getButtonLabel}
                quotedImages={quotedImages}
                setQuotedImages={setQuotedImages}
                quotedUserImage={quotedUserImage}
                quotedContentCreatedDate={quotedContentCreatedDate}
              />
            </>
          )}
        </>
      )}
      {allowMainCom && (
        <>
          <div className="lg:hidden">
            {/* Comment button for mobile */}
            <Button
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-app hover:bg-app/90 text-white"
              size="icon"
              onClick={() => {
                setShowMobileComment(!showMobileComment);
                virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
              }}>
              <MessageSquare size={24} />
            </Button>

            {/* Mobile inline comment section that slides up from bottom */}
            <div
              // className={`fixed left-0 right-0 bottom-0 bg-white border-t border-app-border transition-transform duration-300 ease-in-out transform ${
              //   showMobileComment ? 'translate-y-0' : 'translate-y-full'
              // } z-50`}>

              className={clsx(
                'fixed left-0 right-0 bottom-0 border-t transition-transform duration-300 ease-in-out transform bg-app-hover border-app-border dark:bg-background',
                {
                  'translate-y-0': showMobileComment === true,
                  'translate-y-full': showMobileComment === false,
                },
              )}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold">Add a comment</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowMobileComment(false);
                      setQuoteContent('');
                      setQuotedUser('');
                      setComment('');
                      setImagePreview(null);
                      // virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
                    }}>
                    Cancel
                  </Button>
                </div>

                <div className="mt-1">
                  {/* User info with community guidelines */}
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={currentUser?.avatar ?? undefined} />
                      <AvatarFallback className="capitalize text-app text-3xl">
                        {currentUser?.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm text-app">
                      <Link href="/community-guidelines">
                        Community Guidelines
                      </Link>
                      <span className="mx-1">•</span>
                      <span className="text-[#666]">
                        Be respectful and constructive in your comments.
                      </span>
                    </div>
                  </div>

                  {quotedUser && (
                    <div className="p-3 rounded-md mb-3 border-l-4 border-app bg-gray-100 text-gray-700">
                      <div className="font-semibold mb-1 text-app">
                        @{quotedUser}
                      </div>
                      <div className="text-sm">
                        {/* {quoteContent.replace(/^>\s[\w]+:\s/gm, '')} */}
                        <PostContent2
                          content={quoteContent.replace(/^>\s[\w]+:\s/gm, '')}
                        />
                      </div>
                    </div>
                  )}

                  {/* <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              /> */}
                  <AddCommentField content={comment} setContent={setComment} />

                  {imagePreview && (
                    <div className="relative mt-3 rounded-md overflow-hidden border border-app-border ">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-30 object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        // onClick={removeImage}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                        <X size={16} />
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-app"
                      onClick={() => fileInputRef.current?.click()}>
                      <ImagePlus size={18} />
                    </Button>
                    <Button
                      onClick={handleSubmitComment}
                      className="rounded-full bg-app hover:bg-app/90 text-white"
                      disabled={
                        isSubmitting || (!comment.trim() && !imagePreview)
                      }>
                      <Reply size={16} className="mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            {/* Comment button for web */}
            <Button
              className="fixedBottomBtn max-w-3xl mx-auto fixed bottom-6 right-[26%] h-14 w-14 rounded-full shadow-lg z-1 bg-app hover:bg-app/90 dark:hover:bg-app dark:bg-app/90 text-white"
              size="icon"
              onClick={() => {
                setShowWebComment(!showWebComment);
                virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
              }}>
              <MessageSquare size={24} />
            </Button>

            {/* Web inline comment section that slides up from bottom */}
            <div
              className={clsx(
                'max-w-3xl mx-auto fixed left-0 right-16 bottom-0 border-t transition-transform duration-300 ease-in-out transform z-50 bg-app-hover dark:bg-background border-app-border',
                {
                  'translate-y-0': showWebComment === true,
                  'translate-y-full': showWebComment === false,
                },
              )}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold">Add a comment</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowWebComment(false);
                      setQuoteContent('');
                      setQuotedUser('');
                      setComment('');
                      setImagePreview(null);
                      // virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
                    }}>
                    Cancel
                  </Button>
                </div>

                <div className="mt-1">
                  {/* User info with community guidelines */}
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={currentUser?.avatar ?? undefined} />
                      <AvatarFallback className="capitalize text-app text-3xl">
                        {currentUser?.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* <div className="text-sm text-app">
                  <span>Community Guidelines</span>
                  <span className="mx-1">•</span>
                  <span className="text-[#666]">
                    Be respectful and constructive in your comments.
                  </span>
                </div> */}
                    <CommunityGuidelines />
                  </div>

                  {quotedUser && (
                    <div className="p-3 rounded-md mb-3 border-l-4 border-app bg-gray-100 text-gray-700">
                      <div className="font-semibold mb-1 text-app">
                        @{quotedUser}
                      </div>
                      <div className="text-sm">
                        {/* {quoteContent.replace(/^>\s[\w]+:\s/gm, '')} */}
                        <PostContent2
                          content={quoteContent.replace(/^>\s[\w]+:\s/gm, '')}
                        />
                      </div>
                    </div>
                  )}

                  {/* <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              /> */}
                  <AddCommentField content={comment} setContent={setComment} />

                  {imagePreview && (
                    <div className="relative mt-3 rounded-md overflow-hidden border py-1 border-app-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-30 object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        // onClick={removeImage}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                        <X size={16} />
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={clsx('text-app', {
                        'hover:bg-app-dark-bg/10 hover:text-app':
                          theme.type === 'dark',
                      })}
                      onClick={() => fileInputRef.current?.click()}>
                      <ImagePlus size={18} />
                    </Button>
                    <Button
                      onClick={handleSubmitComment}
                      className="rounded-full bg-app hover:bg-app/90 text-white"
                      disabled={
                        isSubmitting || (!comment.trim() && !imagePreview)
                      }>
                      <Reply size={16} className="mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};
