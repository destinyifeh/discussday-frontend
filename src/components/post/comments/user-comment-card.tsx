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
import {CommentFeedProps, PostFeedProps} from '@/types/post-item.type';
import React from 'react';

import {formatTimeAgo} from '@/lib/formatter';
import {
  EllipsisVertical,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  ThumbsDown,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {usePostStore} from '@/hooks/stores/use-post-store';
import {UserProps} from '@/types/user.types';
import {PostContent} from '../post-content';

interface CommentCardProps {
  comment: CommentFeedProps;
  isFrom: 'replies' | 'mentions' | 'public';
  onLike?: () => void;
  onDisLike?: () => void;
}

const UserCommentCard = ({
  comment,
  isFrom,
  onLike,
  onDisLike,
}: CommentCardProps) => {
  const {theme} = useGlobalStore(state => state);

  const navigate = useRouter();

  const {currentUser} = useAuthStore(state => state);
  const {setPostComment, setQuotedComment, setPost, resetCommentSection} =
    usePostStore(state => state);

  const handleReport = () => {
    toast.success(
      'Thank you for reporting this comment. Our team will review it.',
    );
  };

  const handleQuote = () => {
    const payload = {
      quotedContent: comment.content,
      quotedUser: comment.commentBy.username,
      quotedId: comment._id,
      quotedUserId: comment.commentBy._id,
      quotedImage:
        comment.images && comment.images.map((img: any) => img.secure_url),
      quotedUserImage: comment.commentBy.avatar,
    };

    setQuotedComment(payload);
    setPost(comment.post as PostFeedProps);

    navigate.push(
      `/discuss/${comment.post.section.toLowerCase()}/${comment.post.slugId}/${
        comment.post.slug
      }/reply`,
    );
  };

  const handleEdit = () => {
    setPost(comment.post as PostFeedProps);
    if (comment.quotedComment) {
      const quotedImg = comment.quotedComment.quotedImage
        ? comment.quotedComment.quotedImage.map((url: string) => url)
        : [];
      const pay = {
        quotedContent: comment.quotedComment.quotedContent,
        quotedUser: comment.quotedComment.quotedUser,
        quotedId: comment.quotedComment.quotedId,
        quotedUserId: comment.quotedComment.quotedUserId,
        quotedImage: quotedImg,
        quotedUserImage: comment.quotedComment.quotedUserImage,
      };

      setQuotedComment(pay);
      setPostComment(comment);
    } else {
      setPostComment(comment);
    }
    //navigate.push(`/post/${comment.post._id}/reply`);
    navigate.push(
      `/discuss/${comment.post.section.toLowerCase()}/${comment.post.slugId}/${
        comment.post.slug
      }/reply`,
    );
  };

  const renderCommentContent = () => {
    if (comment) {
      const theComment = comment.content;

      if (comment.quotedComment?.quotedContent) {
        const quoteName = comment.quotedComment?.quotedUser;

        const regularContent = comment.content;

        const {quotedImage, quotedContent} = comment.quotedComment;
        return (
          <>
            <div className="p-3 rounded-md mb-0 bg-gray-100 border-l-4 border-app dark:bg-background">
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

  function isRelevantComment(
    comment: CommentFeedProps,
    currentUser: UserProps | null,
    isFrom: 'replies' | 'mentions' | 'public',
  ) {
    if (isFrom === 'mentions' || isFrom === 'public') return false;

    const quotedUserId = comment.quotedComment?.quotedUserId;
    const isQuotedUser = quotedUserId === currentUser?._id;
    const isCommentedUser =
      !quotedUserId && comment.commentBy?._id === currentUser?._id;

    const isQuotedUserAndCommentedUser =
      quotedUserId && comment.commentBy?._id === currentUser?._id;

    return isQuotedUser || isCommentedUser || isQuotedUserAndCommentedUser;
  }

  const checkUser = isRelevantComment(comment, currentUser, isFrom);

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
  return (
    <div className="border-b py-4 px-2 transition-colors hover:bg-app-hover border-app-border dark:hover:bg-background">
      <div className="flex gap-3">
        <Avatar
          className="w-10 h-10 cursor-pointer active:scale-90 transition-transform duration-150"
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
            {checkUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8">
                    <MoreHorizontal size={16} className="hidden md:block" />
                    <EllipsisVertical size={16} className="md:hidden" />
                    <span className="sr-only">Comment menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="cursor-pointer active:scale-90 transition-transform duration-150">
                    <Pencil size={16} className="mr-2" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleReport}
                    className="cursor-pointer active:scale-90 transition-transform duration-150">
                    <Trash size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="flex flex-row gap-2">
            <p>Replied</p>
            <Link
              href={`/discuss/${comment?.post?.section.toLowerCase()}/${
                comment.post?.slugId
              }/${comment.post?.slug}`}
              className="text-blue-500 active:scale-90 transition-transform duration-150">
              {comment.post?.title}
            </Link>
          </div>

          <div className="mt-1">
            {renderCommentContent()}

            {comment.images &&
              comment.images?.length > 0 &&
              comment.images.map((img, idx) => (
                <div
                  className="mt-3 rounded-lg overflow-hidden aspect-[4/3]"
                  key={img.public_id || idx}>
                  <img
                    src={img.secure_url}
                    alt={`comment attachment ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>

          <div className="flex gap-6 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-app-gray hover:text-app p-0 h-auto active:scale-90 transition-transform duration-150"
              //onClick={() => navigate.push(`/post/${comment.postId}/reply`)}
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
                'text-app-gray hover:text-red-500 p-0 h-auto active:scale-90 transition-transform duration-150',
                isLiked && 'text-red-500',
              )}
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
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <span className="text-xs">{comment.likedBy.length || 0}</span>
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
              className="text-app-gray hover:text-app p-0 h-auto active:scale-90 transition-transform duration-150"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (onDisLike) {
                  onDisLike();
                }
              }}>
              <ThumbsDown
                size={16}
                fill={
                  comment.dislikedBy.includes(currentUser?._id as string)
                    ? 'currentColor'
                    : 'none'
                }
              />
              <span className="text-xs">{comment.dislikedBy.length || 0}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserCommentCard);
