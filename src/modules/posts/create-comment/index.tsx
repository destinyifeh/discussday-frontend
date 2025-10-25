'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';

import {PageHeader} from '@/components/app-headers';
import PostCard from '@/components/post/post-card';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {usePostStore} from '@/hooks/stores/use-post-store';
import {useIsMobile} from '@/hooks/use-mobile';
import {formatTimeAgo} from '@/lib/formatter';
import {
  CommentFeedProps,
  ImageProps,
  PostFeedProps,
} from '@/types/post-item.type';
import {ImagePlus, Reply, Send, Trash2} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {CommentDto, UpdateCommentDto} from '../dto/post-dto';
import {usePostActions} from '../post-hooks';

export const CreateCommentPage = () => {
  const {postId} = useParams<{postId: string}>();
  const {slugId} = useParams<{slugId: string}>();

  const {currentUser} = useAuthStore(state => state);
  const navigate = useRouter();

  const isMobile = useIsMobile();
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [comments, setComments] = useState<CommentFeedProps[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]); // Track removed public_ids
  const [originalImages, setOriginalImages] = useState<ImageProps[]>([]);
  const [editComment, setEditComment] = useState<CommentFeedProps>();
  const [comment, setComment] = useState('');
  const [quoteContent, setQuoteContent] = useState('');
  const [quotedUser, setQuotedUser] = useState('');
  const {postComment, QuotedComment, thePost, resetCommentSection} =
    usePostStore(state => state);
  const {createComment, updateCommentRequest} = usePostActions();
  // Get quote from location state if available

  // const quotedUser = location.state?.quotedUser || '';
  useEffect(() => {
    // setup logic here
    console.log(thePost, 'theposts...');
    if (postComment?.content) {
      const originals = postComment.images || [];
      setOriginalImages(originals);
      setImageUrls(originals.map((img: any) => img.secure_url));
      setComment(postComment.content);
    }
  }, [postComment, setComment]);

  const handleSubmitComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!comment.trim() && !imagePreview) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      let quotePayload = null;
      if (QuotedComment.quotedContent) {
        quotePayload = {
          quotedContent: QuotedComment.quotedContent,
          quotedImage: QuotedComment.quotedImage,
          quotedUser: QuotedComment.quotedUser,
          quotedId: QuotedComment.quotedId,
          quotedUserId: QuotedComment.quotedUserId,
          quotedUserImage: QuotedComment.quotedUserImage,
          quotedContentCreatedDate: QuotedComment.quotedContentCreatedDate,
        };
      }

      if (postComment?.content) {
        updateComment({
          postId: thePost?._id as string,
          content: comment.trim(),
          images: images,
          commentId: postComment?._id as string,
          removedImageIds: removedImageIds,
        });
        return;
      }

      addComment({
        postId: thePost?._id as string,
        content: comment.trim(),
        images: images,
        quotedComment: quotePayload,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addComment = (data: CommentDto) => {
    console.log(data, 'dataa');
    setIsSubmitting(true);
    createComment.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'post data');

        // Clear input and close comment section if open on mobile
        setComment('');
        setQuoteContent('');
        setQuotedUser('');
        setImagePreview(null);

        setImageUrls([]);
        setImages([]);
        toast.success('Comment added successfully');
        navigate.back();
        setTimeout(() => {
          resetCommentSection();
        }, 100);
      },
      onError(error, variables, context) {
        console.log(error, 'post err');

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
        // queryClient.invalidateQueries({
        //   queryKey: ['comment-feed-posts', postId],
        // });
        // Clear input and close comment section if open on mobile
        setComment('');
        setQuoteContent('');
        setQuotedUser('');
        setImagePreview(null);

        setImageUrls([]);
        setImages([]);

        toast.success('Comment updated successfully');
        navigate.back();
        setTimeout(() => {
          resetCommentSection();
        }, 100);
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

  // Function to format the quoted text with styling that matches CommentCard.tsx
  const formatReplyTextarea = () => {
    if (!QuotedComment?.quotedUser) return null;

    // Extract only the quoted content without the username prefix
    // This regex matches '---QUOTE_START---username: ' pattern at the beginning of the string

    return (
      <div className="mb-4">
        {QuotedComment.quotedUser && (
          <div className="p-3 rounded-md mb-3 border-l-4 border-app bg-gray-100 text-gray-700">
            <div className="flex items-center gap-1 mb-1">
              <Link href={`/user/${quotedUser}`}>
                <Avatar className="w-5 h-5">
                  <AvatarImage
                    src={QuotedComment.quotedUserImage ?? undefined}
                  />
                  <AvatarFallback className="text-sm font-semibold text-app capitalize bg-gray-200">
                    {quotedUser.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <p className="text-sm font-semibold text-app capitalize">
                <Link href={`/user/${quotedUser}`}>{quotedUser}</Link>
              </p>
              <span className="text-app-gray">
                · replied{' '}
                {formatTimeAgo(
                  QuotedComment.quotedContentCreatedDate as string,
                )}
              </span>
            </div>
            <div className="text-sm">
              <p
                // className="text-base leading-relaxed"
                style={{whiteSpace: 'pre-wrap'}}>
                {QuotedComment.quotedContent.length > 120
                  ? QuotedComment.quotedContent.slice(0, 120) + '...'
                  : QuotedComment.quotedContent}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {QuotedComment.quotedImage &&
                QuotedComment.quotedImage.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {QuotedComment.quotedImage.map((url, index) => (
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
          </div>
        )}
      </div>
    );
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

  const getMobileButtonLabel = () => {
    if (postComment?.content) {
      return isSubmitting ? 'Updating...' : 'Update';
    }
    return isSubmitting ? 'Replying...' : 'Reply';
  };

  const getWebButtonLabel = () => {
    if (postComment?.content) {
      return isSubmitting ? 'Updating...' : 'Update';
    }
    return isSubmitting ? 'Replying...' : 'Reply';
  };

  const getTitle = () => {
    if (postComment?.content) {
      return 'Edit Reply';
    }
    return 'Reply';
  };

  return (
    <div>
      <div className="flex flex-col h-full">
        {/* Header */}

        <PageHeader title={getTitle()} />

        {/* Original post */}
        <PostCard post={thePost as PostFeedProps} showActions={false} />

        <div className="text-sm text-app px-4 pt-4">
          <Link href="/community-guidelines">Community Guidelines</Link>
          <span className="mx-1">•</span>
          <span className="text-[#666]">
            Be respectful and constructive in your comments.
          </span>
        </div>

        {/* Reply compose area */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={currentUser?.avatar ?? undefined} />
              <AvatarFallback>{currentUser?.username.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {formatReplyTextarea()}

              <Textarea
                placeholder="Reply..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="max-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />

              {imageUrls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
                      <img
                        src={url}
                        alt={`Post attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-600 w-6 h-6"
                        onClick={() => removeImage(index)}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="sticky bottom-0 bg-white border-t border-app-border p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
                id="image-upload"
                max="2"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-app"
                onClick={() => {
                  if (imageUrls.length < 2) {
                    fileInputRef.current?.click();
                  } else {
                    toast.error('Maximum of 2 images allowed');
                  }
                }}
                disabled={imageUrls.length >= 2}>
                <ImagePlus size={18} />
              </Button>
              {/* <Button variant="ghost" size="icon" className="text-app">
                <Video size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-app">
                <SmileIcon size={20} />
              </Button> */}
            </div>

            <Button
              onClick={handleSubmitComment}
              className="rounded-full bg-app hover:bg-app/90"
              disabled={isSubmitting || (!comment.trim() && !imagePreview)}>
              {isMobile ? (
                <>
                  <Reply size={16} className="mr-2" />
                  {getMobileButtonLabel()}
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  {getWebButtonLabel()}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
