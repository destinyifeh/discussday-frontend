import {
  BASIC_AD_PRICE_FOR_7_DAYS,
  BASIC_AD_PRICE_FOR__14_DAYS,
  BASIC_AD_PRICE_FOR__30_DAYS,
  ENTERPRISE_AD_PRICE_FOR_7_DAYS,
  ENTERPRISE_AD_PRICE_FOR__14_DAYS,
  ENTERPRISE_AD_PRICE_FOR__30_DAYS,
  PROFESSIONAL_AD_PRICE_FOR_7_DAYS,
  PROFESSIONAL_AD_PRICE_FOR__14_DAYS,
  PROFESSIONAL_AD_PRICE_FOR__30_DAYS,
} from '@/constants/config';
import {AdPlan, DurationOption, DurationValue} from '@/types/ad-types';

export const pricingTiers = [
  {
    name: 'Basic',
    price: BASIC_AD_PRICE_FOR_7_DAYS,
    unit: 'per week',
    description: 'For small businesses just getting started with advertising',
    features: [
      'Section targeting',
      'Access to performance analytics',
      'Standard support',
    ],
    limitations: [
      'No homepage placement',
      'No explore page placement',
      'No profile page placement',
      'No post detail page visibility',
      'No bookmark page placement',
    ],
  },
  {
    name: 'Professional',
    price: PROFESSIONAL_AD_PRICE_FOR_7_DAYS,
    unit: 'per week',
    description: 'For growing businesses looking to expand their reach',
    featured: true,
    features: [
      'Section targeting',
      'Post detail page visibility',
      'Access to performance analytics',
      'Standard support',
    ],
    limitations: [
      'No homepage placement',
      'No explore page placement',
      'No bookmark page placement',
      'No profile page placement',
    ],
  },
  {
    name: 'Enterprise',
    price: ENTERPRISE_AD_PRICE_FOR_7_DAYS,
    unit: 'per week',
    description: 'For established businesses wanting maximum exposure',
    features: [
      'Homepage placement',
      'Explore page placement',
      'Bookmark page placement',
      'Profile page placement',
      'Post detail page visibility',
      'Full analytics dashboard',
      'Standard support',
    ],
  },
  {
    name: 'Custom',
    price: null,
    unit: null,
    description:
      'Have specific advertising needs? Let’s create a tailored plan that fits your goals.',
    features: [
      'Flexible targeting options',
      'Custom placement and duration',
      'Personalized analytics & reporting',
      'Dedicated support team',
    ],
    contactRequired: true, // optional key if you want a "Contact Us" button
  },
];

export const ctaBtn = [
  {name: 'Learn More'},
  {name: 'Sign Up'},
  {name: 'Get Started'},
  {name: 'Shop Now'},

  {name: 'Download Now'},

  {name: 'Register Now'},
  {name: 'Whatsapp'},
  {name: 'Buy Now'},
  {name: 'Discover More'},
  {name: 'Install App'},
  {name: 'Pre-Order Now'},
  {name: 'Join Now'},
  {name: 'Explore Features'},
  {name: 'See How It Works'},

  {name: 'View Demo'},
  {name: 'Subscribe Now'},
  {name: 'Claim Offer'},
  {name: 'Contact Us'},
  {name: 'Request Access'},
  {name: 'Start Now'},
  {name: 'None'},
];

export const enterPriseAdTypes = [
  {
    id: 'banner',
    name: 'Banner Ad',
    description: 'Static or animated banner displayed on various pages',
    price: `From ${ENTERPRISE_AD_PRICE_FOR_7_DAYS}/week`,
  },
  {
    id: 'sponsored',
    name: 'Sponsored Post',
    description: 'Native-looking sponsored posts in feeds',
    price: `From ${ENTERPRISE_AD_PRICE_FOR_7_DAYS}/week`,
  },
];

export const professionalAdTypes = [
  {
    id: 'banner',
    name: 'Banner Ad',
    description: 'Static or animated banner displayed on various pages',
    price: `From ${PROFESSIONAL_AD_PRICE_FOR_7_DAYS}/week`,
  },
  {
    id: 'sponsored',
    name: 'Sponsored Post',
    description: 'Native-looking sponsored posts in feeds',
    price: `From ${PROFESSIONAL_AD_PRICE_FOR_7_DAYS}/week`,
  },
];
export const basicAdTypes = [
  {
    id: 'banner',
    name: 'Banner Ad',
    description: 'Static or animated banner displayed on various pages',
    price: `From ${BASIC_AD_PRICE_FOR_7_DAYS}/week`,
  },
  {
    id: 'sponsored',
    name: 'Sponsored Post',
    description: 'Native-looking sponsored posts in feeds',
    price: `From ${BASIC_AD_PRICE_FOR_7_DAYS}/week`,
  },
];

export const durations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '$49.99', discount: ''},
  {value: '14', label: '14 Days', price: '$89.99', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '$149.99', discount: 'Save 20%'},
];

// export const enterpriseDurations: DurationOption[] = [
//   {value: '7', label: '7 Days', price: '₦34,020', discount: ''},
//   {value: '14', label: '14 Days', price: '₦61,236', discount: 'Save 10%'},
//   {value: '30', label: '30 Days', price: '₦108,864', discount: 'Save 20%'},
// ];

export const enterpriseDurations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '₦75,600', discount: ''},
  {value: '14', label: '14 Days', price: '₦136,080', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '₦241,920', discount: 'Save 20%'},
];

export const professionalDurations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '₦18,900', discount: ''},
  {value: '14', label: '14 Days', price: '₦34,020', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '₦60,480', discount: 'Save 20%'},
];

export const basicDurations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '₦10,500', discount: ''},
  {value: '14', label: '14 Days', price: '₦17,010', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '₦33,600', discount: 'Save 20%'},
];

export const adPriceFormatter = (duration: string, plan: string) => {
  const PRICE_MAP = {
    basic: {
      '7': BASIC_AD_PRICE_FOR_7_DAYS,
      '14': BASIC_AD_PRICE_FOR__14_DAYS,
      '30': BASIC_AD_PRICE_FOR__30_DAYS,
    },
    professional: {
      '7': PROFESSIONAL_AD_PRICE_FOR_7_DAYS,
      '14': PROFESSIONAL_AD_PRICE_FOR__14_DAYS,
      '30': PROFESSIONAL_AD_PRICE_FOR__30_DAYS,
    },
    enterprise: {
      '7': ENTERPRISE_AD_PRICE_FOR_7_DAYS,
      '14': ENTERPRISE_AD_PRICE_FOR__14_DAYS,
      '30': ENTERPRISE_AD_PRICE_FOR__30_DAYS,
    },
  };

  return PRICE_MAP[plan as AdPlan]?.[duration as DurationValue] ?? 0;
};

// export const BASIC_PLAN_DESCRIPTION =
//   'Reach your ideal audience with the Basic plan—promote your ad in a single section, perfect for focused exposure as a banner or sponsored post.';

// export const PROFESSIONAL_PLAN_DESCRIPTION =
//   'Boost your brand with the Professional plan—your ad appears on the homepage and in a highly relevant section, driving more visibility and engagement.';

// export const ENTERPRISE_PLAN_DESCRIPTION =
//   'Maximize your impact with the Enterprise plan—your ad is featured across the homepage, article pages, and multiple sections for premium, all-around exposure.';

export const BASIC_PLAN_DESCRIPTION =
  'Get started with the Basic plan — promote a single sponsored post within one section to reach a targeted audience and build visibility.';

export const PROFESSIONAL_PLAN_DESCRIPTION =
  'Expand your reach with the Professional plan — your sponsored post appears in key sections and on post detail pages, helping you gain more impressions and engagement.';

export const ENTERPRISE_PLAN_DESCRIPTION =
  'Dominate visibility with the Enterprise plan — your sponsored post is featured across the homepage, explore page, bookmark page and user profiles for maximum reach and exposure.';
