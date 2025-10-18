'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {formatTimeAgo} from '@/lib/formatter';
import {CommentFeedProps} from '@/types/post-item.type';
import clsx from 'clsx';
import {ImagePlus, MessageSquare, Reply, Trash2} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {VirtuosoHandle} from 'react-virtuoso';

type SectionProps = {
  showMobileComment: boolean;
  setShowMobileComment: (show: boolean) => void;
  virtuosoRef: React.RefObject<VirtuosoHandle | null>;
  setQuoteContent: (quote: string) => void;
  setQuotedUser: (user: string) => void;
  setComment: (comment: string) => void;
  setImagePreview: (preview: any) => void;
  comment: string;
  removeImage: (index: number) => void;
  setImageUrls: (urls: string[]) => void;
  setQuotedImages: (urls: string[]) => void;
  quotedImages: string[];
  setImages: (image: any) => void;
  setIsEditing: (isEdit: boolean) => void;
  setEditComment: (comment: CommentFeedProps | null) => void;
  imageUrls: string[];
  handleSubmitComment: () => void;
  getButtonLabel: () => string;
  isSubmitting: boolean;
  isEditing: boolean;
  quotedUser: string;
  quoteContent: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imagePreview: string | null;
  handleImageUpload: (image: React.ChangeEvent<HTMLInputElement>) => void;
  quotedUserImage: string;
  quotedContentCreatedDate: string;
};

export const MobileCommentSection = ({
  showMobileComment,
  setShowMobileComment,
  virtuosoRef,
  setQuoteContent,
  setQuotedUser,
  setComment,
  setImagePreview,
  comment,
  removeImage,
  handleSubmitComment,
  isSubmitting,
  quotedUser,
  fileInputRef,
  imagePreview,
  handleImageUpload,
  quoteContent,
  imageUrls,
  setImageUrls,
  setImages,
  setIsEditing,
  setEditComment,
  isEditing,
  getButtonLabel,
  quotedImages,
  setQuotedImages,
  quotedUserImage,
  quotedContentCreatedDate,
}: SectionProps) => {
  const {currentUser} = useAuthStore(state => state);

  return (
    <div className="lg:hidden ">
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
            <p className="font-semibold">Reply</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowMobileComment(false);
                setQuoteContent('');
                setQuotedUser('');
                setComment('');
                setImagePreview(null);
                setImageUrls([]);
                setImages([]);
                setIsEditing(false);
                setEditComment(null);
                setQuotedImages([]);
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
                <AvatarFallback className="text-app text-3xl">
                  {currentUser?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-app">
                <Link href="/community-guidelines">Community Guidelines</Link>
                <span className="mx-1">•</span>
                <span className="text-[#666]">
                  Be respectful and constructive in your comments.
                </span>
              </div>
            </div>

            {quotedUser && (
              <div className="p-3 rounded-md mb-3 border-l-4 border-app bg-gray-100 text-gray-700">
                <div className="flex items-center gap-1 mb-1">
                  <Link href={`/user/${quotedUser}`}>
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={quotedUserImage ?? undefined} />
                      <AvatarFallback className="text-sm font-semibold text-app bg-gray-200">
                        {quotedUser.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <p className="text-sm font-semibold text-app">
                    <Link href={`/user/${quotedUser}`}>{quotedUser}</Link>
                  </p>

                  <span className="text-app-gray">
                    · replied{' '}
                    {formatTimeAgo(quotedContentCreatedDate as string)}
                  </span>
                </div>
                <div className="text-sm">
                  <p
                    // className="text-base leading-relaxed"
                    style={{whiteSpace: 'pre-wrap'}}>
                    {quoteContent.length > 120
                      ? quoteContent.slice(0, 120) + '...'
                      : quoteContent}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quotedImages.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quotedImages.map((url, index) => (
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

            <Textarea
              placeholder="What's on your mind?"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="max-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />

            {/* <AddCommentField content={comment} setContent={setComment} /> */}

            {imageUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
                    <img
                      src={url}
                      alt={`Comment attachment ${index + 1}`}
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

            <div className="flex justify-between items-center mt-3">
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
              <Button
                onClick={handleSubmitComment}
                className="rounded-full bg-app hover:bg-app/90 text-white"
                disabled={isSubmitting || (!comment.trim() && !imagePreview)}>
                <Reply size={16} className="mr-2" />
                {getButtonLabel()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
