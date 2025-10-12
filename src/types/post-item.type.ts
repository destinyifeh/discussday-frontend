export interface PostProps {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  sectionId: string;
  title: string;
  content: string;
  timestamp: Date | string;
  likes: number;
  reposts: number;
  bookmarks: number;
  comments?: number;
  views?: number;
  images?: string[];
  links?: string[];
  likedBy?: string[];
  isSponsored?: boolean;
  allowComments?: boolean;
  sponsor?: string;
  section?: string;
}

type PostFeedAuthor = {
  username: string;
  avatar?: string;
  _id: string;
};

type CommentFeedAuthor = {
  username: string;
  avatar: string;
  _id: string;
};

export enum PostStatus {
  PUBLISHED = 'published',
  PROMOTED = 'promoted',
}

export type ImageProps = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
};
export interface PostFeedProps {
  _id: string;
  slug: string;
  slugId: string;
  user: PostFeedAuthor;
  title: string;
  content: string;
  createdAt: Date | string;
  section: string;
  images?: ImageProps[];
  likedBy: string[];
  bookmarkedBy: string[];
  viewedBy: string[];
  commentBy: string[];
  commentsClosed?: boolean;
  viewCount: number;
  status: PostStatus;
  commentCount?: number;
  comments?: string[];
}

export interface CommentProps {
  id: string;
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string | Date;
  likes: number;
  verified: boolean;
  image?: string;
  commentId?: string;
}

export interface QuotedCommentProps {
  quotedContent: string;
  quotedUser: string;
  quotedUserImage?: string;
  quotedId: string;
  quotedUserId: string;
  quotedImage?: string[];
  quotedContentCreatedDate?: string;
}

export interface CommentFeedProps {
  _id: string;
  post: PostFeedProps;
  content: string;
  images?: ImageProps[];
  commentBy: CommentFeedAuthor;
  likedBy: string[];
  dislikedBy: string[];
  createdAt: Date | string;
  quotedComment?: QuotedCommentProps | null;
}

export interface AdvertisementProps {
  id: string;
  userId: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  sponsor: string;
  adType: 'banner' | 'post' | 'fullwidth';
  categories: string[];
  plan: 'Basic' | 'Professional' | 'Enterprise';
  duration: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  allowComments?: boolean;
  likes?: number;
  comments?: number;
  views?: number;
  reposts?: number;
  impressions?: number; // Number of times ad was shown
  clicks?: number; // Number of clicks on ad
  ctr?: number; // Click-through rate
}
