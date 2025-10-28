'use client';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import {CommentFeedProps} from '@/types/post-item.type';
import React, {useState} from 'react';

import {formatTimeAgo} from '@/lib/formatter';
import {
  EllipsisVertical,
  Flag,
  Heart,
  LogIn,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  ThumbsDown,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {queryClient} from '@/lib/client/query-client';
import {useReportActions} from '@/modules/dashboard/actions/action-hooks/report.action-hooks';
import {usePostActions} from '@/modules/posts/post-hooks';
import {userService} from '@/services/user-management';
import {UserProps} from '@/types/user.types';
import {useMutation} from '@tanstack/react-query';
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from '../ui/drawer';
import {toast} from '../ui/toast';
import {PostContent} from './post-content';

interface CommentCardProps {
  comment: CommentFeedProps;
  onQuote?: () => void;
  onEdit?: () => void;
  handleQuoteClick: (quote: string) => void;
  onLike?: () => void;
  onDisLike?: () => void;
}

const CommentCard = ({
  comment,
  onQuote,
  onEdit,
  handleQuoteClick,
  onLike,
  onDisLike,
}: CommentCardProps) => {
  const {theme} = useGlobalStore(state => state);
  const [liking, setLiking] = useState(false);
  const navigate = useRouter();
  const {likeCommentRequest, dislikeCommentRequest} = usePostActions();
  const {currentUser, setUser} = useAuthStore(state => state);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });

  const {reportComment} = useReportActions();

  const handleReport = (commentId: string) => {
    const payload = {
      reason: 'No reason provided. Requires admin review.',
      commentId: commentId,
    };

    reportComment.mutate(payload, {
      onSuccess(data, variables, context) {
        console.log(data, 'report data');

        toast.success(
          'Thank you for reporting this comment. Our team will review it.',
        );
      },
      onError(error, variables, context) {
        console.log(error, 'comment report err');

        toast.error(
          'Sorry, we were unable to submit your report. Please try again.',
        );
      },
    });
  };

  const handleQuote = () => {
    if (onQuote) {
      onQuote();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const renderCommentContent = () => {
    if (comment) {
      const theComment = comment.content;

      if (comment.quotedComment?.quotedContent) {
        const quoteName = comment.quotedComment?.quotedUser;

        const regularContent = comment.content;

        const {quotedImage, quotedContent, quotedContentCreatedDate} =
          comment.quotedComment;
        return (
          <>
            <div
              className="p-3 rounded-md mb-0 bg-gray-100 border-l-4 border-app dark:bg-background"
              onClick={() =>
                handleQuoteClick(comment.quotedComment?.quotedId as string)
              }>
              <div className="flex items-center gap-1 mb-1">
                <Link href={`/user/${quoteName}`}>
                  <Avatar className="w-5 h-5">
                    <AvatarImage
                      src={comment.quotedComment.quotedUserImage ?? undefined}
                    />
                    <AvatarFallback className="text-sm font-semibold text-app bg-gray-200">
                      {comment.quotedComment.quotedUser.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <p className="text-sm font-semibold text-app">
                  <Link href={`/user/${quoteName}`}>{quoteName}</Link>
                </p>
                {quotedContentCreatedDate && (
                  <span className="text-app-gray">
                    · replied{' '}
                    {formatTimeAgo(quotedContentCreatedDate as string)}
                  </span>
                )}
              </div>
              {/* <p className="text-gray-700">{quoteContent}</p> */}
              <PostContent content={quotedContent} />

              {quotedImage && quotedImage.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {quotedImage?.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
                      <img
                        src={url}
                        alt={`Comment attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* <p className="whitespace-pre-wrap">{regularContent}</p> */}

            <div className="mt-3">
              <PostContent content={regularContent} />
            </div>
          </>
        );
      }

      if (!theComment && comment.quotedComment?.quotedContent) {
        const quoteName = comment.quotedComment?.quotedUser;
        // If no newline separation, all content after the name is the quote
        // If no delimiter separation, all content after the name is the quote
        const quoteContent = comment.quotedComment?.quotedContent;

        return (
          <div className="p-3 rounded-md mb-0 bg-gray-100 border-l-4 border-app dark:bg-background">
            {/* <p className="text-sm font-semibold text-app mb-1">@{quoteName}</p> */}

            <div className="flex items-center gap-1 mb-1">
              <Link href={`/user/${quoteName}`}>
                <Avatar className="w-5 h-5">
                  <AvatarImage
                    src={comment.quotedComment.quotedUserImage ?? undefined}
                  />
                  <AvatarFallback className="text-sm font-semibold text-app bg-gray-200">
                    {comment.quotedComment.quotedUser.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <p className="text-sm font-semibold text-app">
                <Link href={`/user/${quoteName}`}>{quoteName}</Link>
              </p>
            </div>

            <PostContent content={quoteContent} />
          </div>
        );
      }

      // If no quote or formatting needed, return content as is
      // return <p className="whitespace-pre-wrap">{comment.content}</p>;
      return <PostContent content={comment.content} />;
    }
  };

  const handleFollow = () => {
    if (!currentUser || comment.commentBy?._id === currentUser._id) return;

    setIsPending(true);
    mutate(comment.commentBy?._id, {
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

        queryClient.invalidateQueries({
          queryKey: ['home-feed-posts', 'following'],
        });

        toast.success(message);
      },

      onError(error, variables, context) {
        console.log(error, 'err');
        toast.error('Oops! Something went wrong, please try again.');
      },
      onSettled(data, error, variables, context) {
        setIsPending(false);
      },
    });
  };

  const navigateToUserProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/user/${comment.commentBy.username}`);
  };

  const isLiked = comment.likedBy.includes(currentUser?._id as string);
  const isCommentedUser = comment.commentBy?._id === currentUser?._id;

  const commentLiked = comment.likedBy.includes(currentUser?._id ?? '');
  const likesCount = comment.likedBy.length;

  const commentDisliked = comment.dislikedBy.includes(currentUser?._id ?? '');
  const dislikesCount = comment.dislikedBy.length;

  const isFollowing = currentUser?.following?.includes(
    comment.commentBy?._id?.toString(),
  );

  return (
    <div className="border-b py-4 px-2 transition-colors hover:bg-app-hover border-app-border dark:hover:bg-background">
      <div className="flex gap-3">
        <Avatar
          className="w-10 h-10 active:scale-90 transition-transform duration-150"
          onClick={navigateToUserProfile}>
          <AvatarImage src={comment.commentBy.avatar} />
          <AvatarFallback className="text-app text-3xl">
            {comment.commentBy.username.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link
                href={`/user/${comment.commentBy.username}`}
                className="font-bold hover:underline active:scale-90 transition-transform duration-150">
                {comment.commentBy.username}
              </Link>

              <span className="text-app-gray">
                · replied {formatTimeAgo(comment.createdAt as string)}
              </span>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuDrawerOpen(true);
                }}>
                <EllipsisVertical size={16} className="md:hidden" />
                <span className="sr-only">Comment menu</span>
              </Button>

              <Drawer open={menuDrawerOpen} onOpenChange={setMenuDrawerOpen}>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Comment Options</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col p-4 space-y-2">
                    {currentUser ? (
                      <>
                        {isCommentedUser && (
                          <Button
                            variant="ghost"
                            className="justify-start text-base"
                            onClick={e => {
                              e.preventDefault();
                              setMenuDrawerOpen(false);
                              handleEdit();
                            }}>
                            <Pencil className="mr-2" />
                            Edit comment
                          </Button>
                        )}

                        {!isCommentedUser && (
                          <Button
                            variant="ghost"
                            className="justify-start text-base"
                            onClick={e => {
                              e.preventDefault();
                              setMenuDrawerOpen(false);
                              handleFollow();
                            }}>
                            {isFollowing ? (
                              <>
                                <UserCheck className="mr-2" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        )}
                        {!isCommentedUser && (
                          <Button
                            variant="ghost"
                            className="justify-start text-destructive text-base"
                            onClick={e => {
                              e.preventDefault();
                              setMenuDrawerOpen(false);
                              handleReport(comment._id);
                            }}>
                            <Flag className="mr-2" />
                            Report comment
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="justify-start text-base"
                          onClick={e => {
                            e.preventDefault();
                            setMenuDrawerOpen(false);
                            navigate.push('/login');
                          }}>
                          <LogIn className="mr-2" />
                          Log In
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      className="justify-start text-base"
                      onClick={e => {
                        e.preventDefault();
                        setMenuDrawerOpen(false);
                      }}>
                      <X className="mr-2" />
                      Close
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <div className="hidden md:block">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8">
                    <MoreHorizontal size={16} className="hidden md:block" />
                    <EllipsisVertical size={16} className="md:hidden" />
                    <span className="sr-only">Comment menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currentUser ? (
                    <>
                      {!isCommentedUser && (
                        <DropdownMenuItem
                          onClick={() => handleReport(comment._id)}
                          className="cursor-pointer justify-center active:scale-90 transition-transform duration-150">
                          {/* <Flag size={16} className="mr-2" /> */}
                          Report
                        </DropdownMenuItem>
                      )}
                      {isCommentedUser && (
                        <DropdownMenuItem
                          onClick={handleEdit}
                          className="cursor-pointer justify-center active:scale-90 transition-transform duration-150">
                          {/* <Pencil size={16} className="mr-2" /> */}
                          Edit
                        </DropdownMenuItem>
                      )}
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => navigate.push('/login')}
                      className="cursor-pointer justify-center active:scale-90 transition-transform duration-150">
                      Login
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer justify-center active:scale-90 transition-transform duration-150">
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-1">
            {renderCommentContent()}

            {comment.images &&
              comment.images?.length > 0 &&
              comment.images.map((img, idx) => (
                <div
                  key={img.public_id || idx}
                  className="mt-3 rounded-lg overflow-hidden"
                  style={{
                    aspectRatio: `${img.width}/${img.height}`,
                  }}>
                  <img
                    src={img.secure_url}
                    alt={`comment attachment ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
          </div>

          <div className="flex gap-6 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-app-gray hover:text-app p-0 h-auto active:scale-90 transition-transform duration-150"
              onClick={handleQuote}>
              <MessageSquare size={16} className="mr-1" />
              <span className="text-xs">Reply</span>
            </Button>

            {/* <Button
              variant="ghost"
              size="sm"
              className="text-app-gray hover:text-app p-0 h-auto"
              onClick={handleQuote}>
              <Quote size={16} className="mr-1" />
              <span className="text-xs">Quote</span>
            </Button> */}

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'cursor-pointer text-app-gray hover:text-red-500 p-0 h-auto active:scale-90 transition-transform duration-150',
                commentLiked && 'text-red-500',
              )}
              disabled={liking || !currentUser}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (onLike) {
                  onLike();
                }
              }}>
              <Heart
                size={16}
                className="mr-1"
                fill={commentLiked ? 'currentColor' : 'none'}
              />

              <span className="text-xs">{likesCount}</span>
            </Button>

            {/* <Button
              variant="ghost"
              size="sm"
              className="text-app-gray hover:text-app p-0 h-auto">
              <Share size={16} />
            </Button> */}

            <Button
              variant="ghost"
              size="sm"
              disabled={liking || !currentUser}
              className="cursor-pointer text-app-gray hover:text-app p-0 h-auto active:scale-90 transition-transform duration-150"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (onDisLike) {
                  onDisLike();
                }
                // handleDislike
              }}>
              <ThumbsDown
                size={16}
                fill={commentDisliked ? 'currentColor' : 'none'}
              />

              <span className="text-xs">{dislikesCount}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentCard);
