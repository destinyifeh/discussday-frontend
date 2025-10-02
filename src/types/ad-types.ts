export type AdType = 'sponsored' | 'banner';
export type AdStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'expired'
  | 'paused';

export type AdPlan = 'basic' | 'professional' | 'enterprise';

export type AdPlacementProps =
  | 'homepage_feed'
  | 'details_feed'
  | 'section_feed';

export enum AdCTA {
  None = 'None',
  LearnMore = 'Learn More',
  SignUp = 'Sign Up',
  GetStarted = 'Get Started',
  ShopNow = 'Shop Now',
  DownloadNow = 'Download',
  RegisterNow = 'Register Now',
  BuyNow = 'Buy Now',
  DiscoverMore = 'Discover More',
  InstallApp = 'Install App',
  Whatsapp = 'Whatsapp',
  PreOrderNow = 'Pre-Order Now',
  JoinNow = 'Join Now',
  ExploreFeatures = 'Explore Features',
  SeeHowItWorks = 'See How It Works',
  ViewDemo = 'View Demo',
  SubscribeNow = 'Subscribe Now',
  ClaimOffer = 'Claim Offer',
  ContactUs = 'Contact Us',
  RequestAccess = 'Request Access',
  StartNow = 'Start Now',
}

type AdAuthor = {
  username?: string;
  avatar?: string;
  _id?: string;
};

export interface AdProps {
  _id?: string;
  owner?: AdAuthor;
  type: AdType;
  plan: AdPlan;
  price?: number | string;
  status?: AdStatus;
  createdAt?: string;
  approvedDate?: string;
  rejectedDate?: string;
  pausedDate?: string;
  rejectionReason?: string;
  content?: string;
  targetUrl: string;
  imageUrl?: string;
  callToAction: AdCTA;
  title: string;
  section: string;
  duration?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export type DurationValue = '7' | '14' | '30';

export interface DurationOption {
  value: DurationValue;
  label: string;
  price: string;
  discount?: string;
}

export interface AdPerformanceData {
  _id: string;
  title: string;
  content: string;
  plan: string;
  type: string;
  section: string;
  status: AdStatus;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  startDate?: string;
  endDate?: string;
  price: string;
  rejectionReason?: string;
  imageUrl?: string;
  duration: string;
  expirationDate?: any;
}
