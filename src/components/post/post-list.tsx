'use client';
import {SectionOptions, Sections} from '@/constants/data';
import {ALLOW_FIXED_MOBILE_BOTTOM_TAB} from '@/constants/settings';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {queryClient} from '@/lib/client/query-client';

import {feedService} from '@/services/feed-service';
import {postService} from '@/services/post-service';
import {userService} from '@/services/user-management';
import {UserProps} from '@/types/user.types';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {BookmarkIcon, PenSquare} from 'lucide-react';
import {useRouter} from 'next/navigation';
import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useDebounce} from 'use-debounce';
import AdCard from '../ad/ad-card';
import {SectionHeader} from '../app-headers';
import {LoadingMore, LoadMoreError} from '../feedbacks';
import ErrorFeedback from '../feedbacks/error-feedback';
import SearchBarList from '../forms/list-search-bar';
import {MobileBottomTab} from '../layouts/dashboard/mobile-bottom-tab';
import MobileNavigation from '../layouts/dashboard/mobile-navigation';
import {HomeDashboardSkeleton} from '../skeleton/home-dashboard-skeleton';
import PostSkeleton from '../skeleton/post-skeleton';
import {Badge} from '../ui/badge';
import {Button} from '../ui/button';
import {Tabs, TabsList, TabsTrigger} from '../ui/tabs';
import {toast} from '../ui/toast';
import {UserCard} from '../user/user-card';
import PostCard from './post-card';

export const SectionPostList = ({
  adSection,
  section,
  title,
  description,
}: {
  adSection: string;
  section: string;
  title: string;
  description: string;
}) => {
  const lastScrollTop = useRef(0);
  const {currentUser} = useAuthStore(state => state);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const {setShowBottomTab} = useGlobalStore(state => state);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const navigate = useRouter();
  const shouldQuery = !!section;
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
    queryKey: ['section-feed-posts', section],
    queryFn: ({pageParam = 1}) =>
      feedService.getSectionPostFeeds(pageParam, 10, section),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    enabled: shouldQuery,
    retry: 1,
    // refetchInterval: 5000, // Poll every 5s
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  const sectionData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log(data, 'section dataa');

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['section-feed-posts', section],
      });

      const previousPosts = queryClient.getQueryData([
        'section-feed-posts',
        section,
      ]);

      queryClient.setQueryData(
        ['section-feed-posts', section],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasLiked = post.data.likedBy.includes(userId);
                  const newLikedBy = hasLiked
                    ? post.data.likedBy.filter((id: string) => id !== userId)
                    : [...post.data.likedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      likedBy: newLikedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['section-feed-posts', section],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['section-feed-posts', section],
      });

      const previousPosts = queryClient.getQueryData([
        'section-feed-posts',
        section,
      ]);

      queryClient.setQueryData(
        ['section-feed-posts', section],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasBookmarked = post.data.bookmarkedBy.includes(userId);
                  const newBookmarkedBy = hasBookmarked
                    ? post.data.bookmarkedBy.filter(
                        (id: string) => id !== userId,
                      )
                    : [...post.data.bookmarkedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      bookmarkedBy: newBookmarkedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['section-feed-posts', section],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

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

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  return (
    <div>
      {/* <div
        className={`lg:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <SectionHeader title={title} description={description} />
      </div> */}
      <div className="">
        <SectionHeader title={title} description={description} />
      </div>

      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        onScroll={handleScroll}
        ref={virtuosoRef}
        data={sectionData}
        components={{
          Header: () => <div className="lg:mt-0"></div>,
          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <SectionPlaceholder section={section} />;
          },

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
            if (!post || !post.data) {
              return null;
            }
            if (post._type === 'ad') {
              return <AdCard ad={post.data} key={post.data._id} />;
            }
            return (
              <PostCard
                post={post.data}
                key={post.data._id}
                onLike={() => likePostMutation.mutate(post.data._id)}
                onBookmark={() => bookmarkPostMutation.mutate(post.data._id)}
              />
            );
          }
        }}
      />
      {currentUser && (
        <div>
          <Button
            className="fixed bottom-6 h-14 w-14 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition"
            // className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-app hover:bg-app/90 text-white"
            size="icon"
            onClick={() => {
              navigate.push(`/discuss?section=${section.toLowerCase()}`);
            }}>
            <PenSquare size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};

export const HomePostList = () => {
  const lastScrollTop = useRef(0);

  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useRouter();
  const {currentUser} = useAuthStore(state => state);
  console.log(currentUser, 'currentooo');
  const [mounted, setMounted] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  console.log(activeTab, 'activtabbb');
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
    queryKey: ['home-feed-posts', activeTab],
    queryFn: ({pageParam = 1}) =>
      feedService.getHomePostFeeds(pageParam, 10, activeTab),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    //refetchInterval: 30000, //poll every 15s
    //refetchIntervalInBackground: false,
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  const postsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  console.log(postsData, 'postdaaa');

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['home-feed-posts', activeTab],
      });

      const previousPosts = queryClient.getQueryData([
        'home-feed-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['home-feed-posts', activeTab],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasLiked = post.data.likedBy.includes(userId);
                  const newLikedBy = hasLiked
                    ? post.data.likedBy.filter((id: string) => id !== userId)
                    : [...post.data.likedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      likedBy: newLikedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      // This makes UI update immediately
      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['home-feed-posts', activeTab],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {
      // This re-fetch causes the delay — it’s optional
      // queryClient.invalidateQueries({ queryKey: ['home-feed-posts', activeTab] });
    },
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['home-feed-posts', activeTab],
      });

      const previousPosts = queryClient.getQueryData([
        'home-feed-posts',
        activeTab,
      ]);

      queryClient.setQueryData(
        ['home-feed-posts', activeTab],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasBookmarked = post.data.bookmarkedBy.includes(userId);
                  const newBookmarkedBy = hasBookmarked
                    ? post.data.bookmarkedBy.filter(
                        (id: string) => id !== userId,
                      )
                    : [...post.data.bookmarkedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      bookmarkedBy: newBookmarkedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      // This makes UI update immediately
      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['home-feed-posts', activeTab],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {
      //  This re-fetch causes the delay — it’s optional
      // queryClient.invalidateQueries({ queryKey: ['home-feed-posts', activeTab] });
    },
  });

  if (!mounted) return <HomeDashboardSkeleton />;

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide
      setShowBottomTab(false);
      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show
      setShowBottomTab(true);
      setShowMobileNav(true);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const onSectionNavigate = (section: string) => {
    if (section === 'Create Ad') {
      navigate.push('/advertise');
      return;
    }
    navigate.push(`/discuss/${section.toLowerCase()}`);
  };

  const onSectionOptionsNavigate = (section: string) => {
    navigate.push(`/${section}`);
  };

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  const allowTab = false;

  return (
    <div>
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <MobileNavigation />
      </div>

      <Virtuoso
        className="custom-scrollbar min-h-screen mb-12 md:mb-0"
        data={postsData}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div className="mt-15 md:mt-0">
              {!allowTab && (
                <Tabs
                  defaultValue="for-you"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full">
                  {/* <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                    <TabsList className="w-full grid grid-cols-2 border-b rounded-none border-app-border bg-white">
                      <TabsTrigger
                        value="for-you"
                        className="data-[state=active]:font-bold rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3 data-[state=active]:text-black">
                        Trending
                      </TabsTrigger>
                      <TabsTrigger
                        value="following"
                        className="data-[state=active]:font-bold rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3 data-[state=active]:text-black">
                        Following
                      </TabsTrigger>
                    </TabsList>
                  </div> */}

                  <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                    <TabsList className="w-full grid grid-cols-2 border-b border-app-border rounded-none bg-background">
                      <TabsTrigger
                        value="for-you"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3">
                        Trending
                      </TabsTrigger>
                      <TabsTrigger
                        value="following"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3">
                        Following
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              )}
              <div className="px-0 py-3 mt-3 border-b border-app-border lg:hidden md:mt-7">
                <div className="px-4">
                  <h2 className="font-semibold mb-2 mt-0">Discuss</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Sections.map(section => (
                      <Badge
                        key={section.id}
                        variant="outline"
                        className="py-1 px-3 cursor-pointer dark:bg-muted hover:bg-app-hover text-app active:scale-90 transition-transform duration-150"
                        // className="py-1 px-3 cursor-pointer hover:bg-app-hover"
                        onClick={() => onSectionNavigate(section.name)}>
                        {section.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                {currentUser && (
                  <div className="px-4 flex flex-wrap gap-2 mb-2 border-t pt-3 border-app-border">
                    {SectionOptions.map(section => (
                      <Badge
                        key={section.id}
                        variant="outline"
                        className="py-1 px-3 cursor-pointer dark:bg-muted hover:bg-app-hover text-app active:scale-90 transition-transform duration-150"
                        //className="py-1 px-3 cursor-pointer hover:bg-app-hover"
                        onClick={() =>
                          onSectionOptionsNavigate(
                            section.description as string,
                          )
                        }>
                        {section.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <PostPlaceholder tab={activeTab} />;
          },

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
            if (!post || !post.data) {
              return null;
            }
            if (post._type === 'ad') {
              return <AdCard ad={post.data} key={post.data._id} />;
            }
            return (
              <PostCard
                post={post.data}
                key={post.data._id}
                onLike={() => likePostMutation.mutate(post.data._id)}
                onBookmark={() => bookmarkPostMutation.mutate(post.data._id)}
              />
            );
          }
        }}
      />
      {ALLOW_FIXED_MOBILE_BOTTOM_TAB ? (
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
          <MobileBottomTab />
        </div>
      ) : (
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-50 transition-transform duration-300 ${
            showBottomTab ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <MobileBottomTab />
        </div>
      )}
    </div>
  );
};

export const ExplorePostList = () => {
  const lastScrollTop = useRef(0);
  const {currentUser, setUser} = useAuthStore(state => state);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [showTopElement, setShowTopElement] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });
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
    queryKey: ['explore-feed-posts', activeTab, debouncedSearch],
    queryFn: ({pageParam = 1}) =>
      feedService.getExplorePostFeeds(
        pageParam,
        10,
        activeTab,
        debouncedSearch,
      ),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
  });
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const postsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('should query', error);

  console.log(postsData, 'should query dataa', totalCount);

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['explore-feed-posts', activeTab, debouncedSearch],
      });

      const previousPosts = queryClient.getQueryData([
        'explore-feed-posts',
        activeTab,
        debouncedSearch,
      ]);

      queryClient.setQueryData(
        ['explore-feed-posts', activeTab, debouncedSearch],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasLiked = post.data.likedBy.includes(userId);
                  const newLikedBy = hasLiked
                    ? post.data.likedBy.filter((id: string) => id !== userId)
                    : [...post.data.likedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      likedBy: newLikedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['explore-feed-posts', activeTab, debouncedSearch],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['explore-feed-posts', activeTab, debouncedSearch],
      });

      const previousPosts = queryClient.getQueryData([
        'explore-feed-posts',
        activeTab,
        debouncedSearch,
      ]);

      queryClient.setQueryData(
        ['explore-feed-posts', activeTab, debouncedSearch],
        (oldData: any) => {
          if (!oldData) return previousPosts;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post._type === 'ad') return post;
                if (post.data._id === postId) {
                  const userId = currentUser?._id;
                  const hasBookmarked = post.data.bookmarkedBy.includes(userId);
                  const newBookmarkedBy = hasBookmarked
                    ? post.data.bookmarkedBy.filter(
                        (id: string) => id !== userId,
                      )
                    : [...post.data.bookmarkedBy, userId];

                  return {
                    ...post,
                    data: {
                      ...post.data,
                      bookmarkedBy: newBookmarkedBy,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['explore-feed-posts', activeTab, debouncedSearch],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  if (!mounted) return <HomeDashboardSkeleton />;

  // Scroll handler

  const handleScroll2: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide
      setShowBottomTab(false);
      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show
      setShowBottomTab(true);
      setShowMobileNav(true);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Hide the special element after 50px
    if (scrollTop > 50) {
      setShowTopElement(false);
    } else {
      setShowTopElement(true);
    }

    // Hide mobile nav only when past 100px
    if (scrollTop > 100) {
      setShowMobileNav(false);
    } else {
      setShowMobileNav(true);
    }

    // Detect scroll direction
    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide bottom tab
      setShowBottomTab(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up (even slightly) → show immediately
      setShowBottomTab(true);
      setShowMobileNav(true);
    }

    // Always update lastScrollTop
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

  const handleFollowUser = (id: string) => {
    setIsPending(true);
    mutate(id, {
      onSuccess(response, variables, context) {
        console.log(response, 'datameee');

        const {message, currentUserFollowings} = response.data;

        setUser({
          ...(currentUser as UserProps),
          following: currentUserFollowings,
        });
        toast.success(message);
      },

      onError(error: any, variables, context) {
        console.log(error, 'err');
        const {message} = error?.response?.data ?? {};
        toast.error(message);
      },
      onSettled(data, error, variables, context) {
        setIsPending(false);
      },
    });
  };

  return (
    <div>
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <MobileNavigation
          showSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchRef={searchRef}
          showLogo={false}
        />
      </div>

      <div className="hidden md:block">
        <SearchBarList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ref={searchRef}
        />
      </div>

      <Virtuoso
        className="custom-scrollbar mb-12 md:mb-0"
        style={{height: '100vh'}}
        data={postsData}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div className="mt-18 md:mt-0">
              <Tabs
                defaultValue="for-you"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full mb-5">
                <TabsList className="w-full grid grid-cols-4 bg-transparent">
                  <TabsTrigger
                    value="for-you"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Trending
                  </TabsTrigger>
                  <TabsTrigger
                    value="latest"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Latest
                  </TabsTrigger>
                  <TabsTrigger
                    value="people"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    People
                  </TabsTrigger>
                  <TabsTrigger
                    value="following"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Following
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          ),
          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return (
              <ExplorePlaceholder
                activeTab={activeTab}
                query={searchTerm}
                data={postsData}
              />
            );
          },

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
            return <PostSkeleton key={`skeleton-${index}`} />;
          }

          if (!post || !post.data) {
            return null;
          }

          if (post?._type === 'ad') {
            return <AdCard ad={post.data} key={post.data._id} />;
          }

          if (post.data && post.data?.username) {
            const user = post.data;

            const isCurrentUser = currentUser?.username === user.username;
            const isFollowing = currentUser?.following?.includes(
              user._id?.toString(),
            );

            return (
              <UserCard
                key={user._id}
                user={user}
                isCurrentUser={isCurrentUser}
                isFollowing={isFollowing}
                handleFollowUser={() => handleFollowUser(user._id)}
              />
            );
          }

          if (post.data && !post.data?.username) {
            return (
              <PostCard
                key={post.data._id}
                post={post.data}
                onLike={() => likePostMutation.mutate(post.data._id)}
                onBookmark={() => bookmarkPostMutation.mutate(post.data._id)}
              />
            );
          }
        }}
      />
      {ALLOW_FIXED_MOBILE_BOTTOM_TAB ? (
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
          <MobileBottomTab />
        </div>
      ) : (
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-50 transition-transform duration-300 ${
            showBottomTab ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <MobileBottomTab />
        </div>
      )}
    </div>
  );
};

export const BookmarkPostList = () => {
  const {currentUser} = useAuthStore(state => state);
  const lastScrollTop = useRef(0);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const navigate = useRouter();

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
    queryKey: ['bookmarked-feed-posts'],
    queryFn: ({pageParam = 1}) =>
      feedService.getUserBookmarkedPostFeeds(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
  });

  const bookmarkedData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log(data, 'bookmarked dataa');

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postService.likePostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['bookmarked-feed-posts'],
      });

      const previousPosts = queryClient.getQueryData(['bookmarked-feed-posts']);

      queryClient.setQueryData(['bookmarked-feed-posts'], (oldData: any) => {
        if (!oldData) return previousPosts;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => {
              if (post._type === 'ad') return post;
              if (post.data._id === postId) {
                const userId = currentUser?._id;
                const hasLiked = post.data.likedBy.includes(userId);
                const newLikedBy = hasLiked
                  ? post.data.likedBy.filter((id: string) => id !== userId)
                  : [...post.data.likedBy, userId];

                return {
                  ...post,
                  data: {
                    ...post.data,
                    likedBy: newLikedBy,
                  },
                };
              }
              return post;
            }),
          })),
        };
      });

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['bookmarked-feed-posts'],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {},
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postService.bookmarkPostRequestAction(postId),

    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: ['bookmarked-feed-posts'],
      });

      const previousPosts = queryClient.getQueryData(['bookmarked-feed-posts']);

      queryClient.setQueryData(['bookmarked-feed-posts'], (oldData: any) => {
        if (!oldData) return previousPosts;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => {
              if (post._type === 'ad') return post;
              if (post.data._id === postId) {
                const userId = currentUser?._id;
                const hasBookmarked = post.data.bookmarkedBy.includes(userId);
                const newBookmarkedBy = hasBookmarked
                  ? post.data.bookmarkedBy.filter((id: string) => id !== userId)
                  : [...post.data.bookmarkedBy, userId];

                return {
                  ...post,
                  data: {
                    ...post.data,
                    bookmarkedBy: newBookmarkedBy,
                  },
                };
              }
              return post;
            }),
          })),
        };
      });

      return {previousPosts};
    },

    onError: (err, postId, context: any) => {
      queryClient.setQueryData(
        ['bookmarked-feed-posts'],
        context.previousPosts,
      );
      toast.error('Oops! Something went wrong, try again');
    },

    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['bookmarked-feed-posts']});
    },
  });

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Hide mobile nav only when past 100px
    if (scrollTop > 100) {
      setShowMobileNav(false);
    } else {
      setShowMobileNav(true);
    }

    // Detect scroll direction
    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide bottom tab
      setShowBottomTab(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up (even slightly) → show immediately
      setShowBottomTab(true);
      setShowMobileNav(true);
    }

    // Always update lastScrollTop
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
    <div className="lg:pb-0">
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <MobileNavigation title="Bookmarks" />
      </div>

      <Virtuoso
        className="custom-scrollbar mb-12 md:mb-0"
        style={{height: '100vh'}}
        onScroll={handleScroll}
        ref={virtuosoRef}
        data={bookmarkedData}
        components={{
          Header: () => <div className="mt-18 md:mt-0"></div>,

          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <Placeholder holder={'bookmark'} />;
          },

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
            if (!post || !post.data) {
              return null;
            }
            if (post._type === 'ad') {
              return <AdCard ad={post.data} key={post.data._id} />;
            }
            return (
              <PostCard
                post={post.data}
                key={post.data._id}
                onLike={() => likePostMutation.mutate(post.data._id)}
                onBookmark={() => bookmarkPostMutation.mutate(post.data._id)}
              />
            );
          }
        }}
      />
      {ALLOW_FIXED_MOBILE_BOTTOM_TAB ? (
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
          <MobileBottomTab />
        </div>
      ) : (
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-50 transition-transform duration-300 ${
            showBottomTab ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <MobileBottomTab />
        </div>
      )}
    </div>
  );
};

export const PostPlaceholder = ({tab}: {tab: string}) => {
  const navigate = useRouter();
  const {currentUser} = useAuthStore(state => state);
  return (
    <div className="p-8 text-center">
      {tab === 'for-you' ? (
        <>
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          <p className="text-app-gray">Be the first to post!</p>
        </>
      ) : (
        <>
          {!currentUser ? (
            <>
              <h2 className="text-xl font-bold mb-2">Sign in to see posts</h2>
              <p className="text-app-gray mb-4">
                Log in to follow people and see their latest posts here.
              </p>
              <button
                className="bg-app hover:bg-app/90 text-white px-5 py-2 rounded-full text-sm font-medium"
                onClick={() => navigate.push('/login')}>
                Log In
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">
                No posts from your follows
              </h2>
              <p className="text-app-gray mb-4">
                Follow more people to see their posts here!
              </p>
              <button
                className="bg-app hover:bg-app/90 text-white px-5 py-2 rounded-full text-sm font-medium"
                onClick={() => navigate.push('/users')}>
                Find people to follow
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export const Placeholder = ({
  holder,
  query,
}: {
  holder: string;
  query?: string;
}) => {
  const navigate = useRouter();
  return (
    <div className="p-8 text-center">
      {holder === 'explore' && (
        <>
          <h2 className="text-xl font-bold mb-2">
            No search result for {query} found
          </h2>
          <p className="text-app-gray">Try another search!</p>
        </>
      )}
      {holder === 'bookmark' && (
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <div className="bg-app-hover rounded-full p-4 mb-4">
            <BookmarkIcon size={32} className="text-app" />
          </div>
          <h2 className="text-xl font-bold mb-2">No bookmarks yet</h2>
          <p className="text-app-gray mb-4">
            When you bookmark posts, they will appear here for easy access.
          </p>
        </div>
      )}
    </div>
  );
};

export const SectionPlaceholder = (props: {section: string}) => {
  const navigate = useRouter();
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">No discussions yet</h2>
      <p className="text-app-gray">Be the first to post in this section!</p>
      <Button
        className="mt-4 bg-app hover:bg-app/90"
        onClick={() =>
          navigate.push(`/discuss?section=${props.section.toLowerCase()}`)
        }>
        Start Discussion
      </Button>
    </div>
  );
};

export const CommentPlaceholder = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">No replies yet</h2>
      <p className="text-app-gray">Be the first to reply!</p>
    </div>
  );
};

export const ExplorePlaceholder = ({
  activeTab,
  query,
  data,
}: {
  activeTab: string;
  query?: string;
  data: any;
}) => {
  const navigate = useRouter();
  const {currentUser} = useAuthStore(state => state);
  return (
    <div className="p-8 text-center">
      {/* Search results empty */}
      {query && !data.length && (
        <>
          <h2 className="text-xl font-bold mb-2">
            No results found for "{query}"
          </h2>
          <p className="text-app-gray">Try another search!</p>
        </>
      )}

      {/* People tab empty */}
      {activeTab === 'people' && !data.length && !query && (
        <>
          <h2 className="text-xl font-bold mb-2">No users found</h2>
          <p className="text-app-gray">
            Check back later for more users to follow.
          </p>
        </>
      )}

      {/* For-you / Latest empty */}
      {(activeTab === 'for-you' || activeTab === 'latest') &&
        !data.length &&
        !query && (
          <>
            <h2 className="text-xl font-bold mb-2">No posts yet</h2>
            <p className="text-app-gray">Be the first to post!</p>
          </>
        )}

      {/* Following empty */}
      {currentUser && activeTab === 'following' && !data.length && !query && (
        <>
          <h2 className="text-xl font-bold mb-2">No posts from your follows</h2>
          <p className="text-app-gray mb-4">
            Follow more people to see their posts here!
          </p>
          <button
            className="bg-app hover:bg-app/90 text-white px-5 py-2 rounded-full text-sm font-medium"
            onClick={() => navigate.push('/users')}>
            Find people to follow
          </button>
        </>
      )}

      {!currentUser && activeTab === 'following' && (
        <>
          <h2 className="text-xl font-bold mb-2">Sign in to see posts</h2>
          <p className="text-app-gray mb-4">
            Log in to follow people and see their latest posts here.
          </p>
          <button
            className="bg-app hover:bg-app/90 text-white px-5 py-2 rounded-full text-sm font-medium"
            onClick={() => navigate.push('/login')}>
            Log In
          </button>
        </>
      )}
    </div>
  );
};

export const ExploreMobileHeader = ({
  searchTerm,
  setSearchTerm,
  ref,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  ref: any;
}) => {
  return (
    <Fragment>
      <MobileNavigation />
      <SearchBarList
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        ref={ref}
      />
    </Fragment>
  );
};
