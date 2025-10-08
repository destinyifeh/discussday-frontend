import {AdCTA, AdPlan, DurationValue} from '@/types/ad-types';
import {SectionName} from '@/types/section';

type AdType = 'sponsored' | 'banner';
export interface CreateAdDto {
  type: AdType;

  title: string;

  content?: string;

  plan: AdPlan;

  section: SectionName | string;

  price: string;

  targetUrl: string;

  callToAction: AdCTA;

  duration: DurationValue;

  image?: File | null;

  imageUrl?: string;

  targetType?: string;

  whatsappNumber?: string;

  adId?: string;

  removedImageId?: string;

  image_public_id?: string;
}
