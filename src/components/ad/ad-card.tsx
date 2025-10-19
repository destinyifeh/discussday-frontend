'use client';
import {cn} from '@/lib/utils';
import {useAdActions} from '@/modules/dashboard/actions/action-hooks/ad.action-hooks';
import {adService} from '@/modules/dashboard/actions/ad.actions';
import {AdProps} from '@/types/ad-types';
import {useQuery} from '@tanstack/react-query';
import copy from 'copy-to-clipboard';
import {
  BarChart3,
  Bookmark,
  EllipsisVertical,
  Flag,
  Heart,
  LinkIcon,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {Button} from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover';
import {toast} from '../ui/toast';

interface AdCardProps {
  ad: AdProps;
  showActions?: boolean;
  isInDetailView?: boolean;
}

const AdCard = ({
  ad,
  showActions = true,
  isInDetailView = false,
}: AdCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const {updateAdClicksRequest} = useAdActions();
  const navigate = useRouter();
  const shouldQuery = !!ad._id;
  const {error, data: impressionData} = useQuery({
    queryKey: ['ad-impressions-count', ad._id],
    queryFn: () => adService.updateAdImpressions(ad._id),
    retry: 1,
    enabled: shouldQuery,
  });
  console.log(impressionData, 'ad impressionData');

  const onCallToAction2 = () => {
    let url = ad.targetUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const clickUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ad/${ad._id}/clicks`;
    navigator.sendBeacon(clickUrl);

    // open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onCallToAction = () => {
    let url = ad.targetUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const clickUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ad/${ad._id}/clicks`;
    navigator.sendBeacon(clickUrl);

    const isInternal = url.startsWith(window.location.origin);

    if (isInternal) {
      // ✅ Use Next.js router for internal links
      navigate.push(url.replace(window.location.origin, ''));
    } else {
      // ✅ External → full redirect
      window.location.href = url;
      //  window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const liked = true;

  const handleReport = () => {
    toast.success(
      'Thank you for reporting this post. Our team will review it.',
    );
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigate.push(`/create-post?postId`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/post/`);
  };

  const navigateToUserProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/profile/`);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/post/${ad?._id}`;
    try {
      copy(postUrl);
      toast.success('Post link has been copied to clipboard.');
      setTimeout(() => setSharePopoverOpen(false), 500);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast.error('Failed to copy link, please try again.');
    }
  };

  const shouldTruncate = ad && ad.content && ad.content.length > 100;
  const sliceContent = ad && ad.content && ad.content.slice(0, 100) + '...';

  const displayContent =
    shouldTruncate && !expanded && !isInDetailView ? sliceContent : ad?.content;

  return (
    <div className="border-b border-app-border py-4 px-2 transition-colors hover:bg-app-hover dark:hover:bg-background border-app-border">
      <div className="flex gap-3">
        <Avatar
          className="w-10 h-10 cursor-pointer"
          onClick={navigateToUserProfile}>
          <AvatarImage src={ad?.owner?.avatar ?? undefined} />
          <AvatarFallback className="text-app text-3xl">
            {ad.owner?.username?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="font-bold hover:underline truncate cursor-pointer">
                  <Link href={`/user/${ad?.owner?.username}`} className="">
                    {ad?.owner?.username}
                  </Link>
                </div>

                <span className="text-app-gray">·</span>

                <span className="truncate capitalize">{ad?.type}</span>

                {/* <span className="text-app-gray">·</span>
                <span className="text-app-gray truncate">
                  {formatTimeAgo(post.timestamp)}
                </span> */}
              </div>
              {isInDetailView && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      <MoreHorizontal size={16} className="hidden md:block" />
                      <EllipsisVertical size={16} className="md:hidden" />
                      <span className="sr-only">Ad menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleEditPost}
                      className="cursor-pointer">
                      <Pencil size={16} className="mr-2" />
                      Edit post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleReport}
                      className="cursor-pointer text">
                      <Flag size={16} className="mr-2" />
                      Report post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="block">
            <div className="mt-1">
              <p className="text-base leading-normal">{displayContent}</p>

              {shouldTruncate && !isInDetailView && !expanded && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    //navigate.push(`/post/${ad.id}`);
                    setExpanded(true);
                  }}>
                  See more
                </Button>
              )}

              {expanded && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    //navigate.push(`/post/${ad.id}`);
                    setExpanded(false);
                  }}>
                  See less
                </Button>
              )}

              {ad?.imageUrl && (
                // <div className="mt-3 rounded-xl overflow-hidden">
                //   <img
                //     src={ad.imageUrl}
                //     alt="Ad attachment"
                //     className="w-full h-auto object-cover max-h-60 sm:max-h-80 md:max-h-96"
                //   />
                // </div>

                // <div className="mt-3 rounded-xl overflow-hidden h-96">
                <div
                  className="mt-3 rounded-xl overflow-hidden"
                  style={{
                    aspectRatio: `${ad.imageWidth}/${ad.imageHeight}`,
                  }}>
                  <img
                    src={ad.imageUrl}
                    alt="Ad attachment"
                    className="w-full h-full object-cover"
                    // className="w-full h-auto max-h-96 object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {!showActions && (
              <div className="flex justify-between mt-3 max-w-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={handleCommentClick}>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={18} />
                    <span className="text-xs">
                      {/* {formatNumber(ad?.adComments || 0)} */}
                    </span>
                  </div>
                </Button>

                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <div className="flex items-center gap-1">
                    <Repeat2 size={18} />
                    <span className="text-xs">
                      {formatNumber(post.reposts)}
                    </span>
                  </div>
                </Button> */}

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'text-app-gray hover:text-red-500',
                    liked && 'text-red-500',
                  )}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    //handleLike();
                  }}>
                  <div className="flex items-center gap-1">
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-xs">
                      {/* {formatNumber(ad?.adLikes ?? 0)} */}
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <div className="flex items-center gap-1">
                    <BarChart3 size={18} />
                    <span className="text-xs">
                      {/* {formatNumber(ad?.adViews || 0)} */}
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <Bookmark size={18} />
                </Button>

                <Popover
                  open={sharePopoverOpen}
                  onOpenChange={setSharePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-app-gray hover:text-app"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSharePopoverOpen(!sharePopoverOpen);
                      }}>
                      <Share2 size={18} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={handleCopyLink}>
                        <LinkIcon size={16} className="mr-2" />
                        Copy link
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {ad.targetUrl && (
              <div className="flex justify-between items-center mt-3">
                <p className="font-bold leading-normal text-base">
                  {ad?.title}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  //className="text-app hover:bg-app/90 "
                  className="rounded-full border border-[1.4px] border-app text-app font-bold hover:border-app/90 hover:text-app/90 text-sm"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCallToAction();
                  }}>
                  {ad.targetUrl && ad?.callToAction === 'None'
                    ? 'Learn More'
                    : ad?.callToAction}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdCard);
