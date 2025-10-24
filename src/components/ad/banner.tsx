'use client';

import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import {adService} from '@/services/ad-service';

import {AdPlacementProps, AdProps} from '@/types/ad-types';
import {useQuery} from '@tanstack/react-query';
import {ExternalLink} from 'lucide-react';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';

export interface BannerAdProps {
  ad: AdProps;
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
  animation?: any;
}

export function BannerAd({
  ad,
  size = 'medium',
  position,
  className,
  animation,
}: BannerAdProps) {
  const {theme} = useGlobalStore(state => state);
  const [imgSrc, setImgSrc] = useState(ad.imageUrl || '/public/logo_blue.webp');
  const sizeClasses = {
    small: 'h-[90px]',
    medium: 'h-[120px]',
    large: 'h-[250px]',
  };

  return (
    <div
      className={cn(
        'relative mx-auto w-full overflow-hidden rounded-lg border bg-white dark:bg-background border-app-border ',
        sizeClasses[size],
        className,
      )}>
      <div className="absolute right-2 top-2 z-10 rounded bg-black/70 px-2 py-1 text-xs text-white">
        Sponsored
      </div>
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full w-full">
        {imgSrc.startsWith('data:') ? (
          <div className="relative h-full w-full">
            <Image
              src={imgSrc}
              alt={ad.title}
              priority
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              onError={() => setImgSrc('/placeholder.svg')}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/10 group-hover:opacity-100">
              <ExternalLink className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </div>
        ) : (
          <div
            className="relative h-full w-full"
            style={{
              opacity: animation ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}>
            <Image
              src={imgSrc}
              alt={ad.title}
              priority
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              onError={() => setImgSrc('/placeholder.svg')}
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/10 group-hover:opacity-100">
              <ExternalLink className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </div>
        )}
      </a>
    </div>
  );
}

export function BannerAds2({
  section,
  placement,
}: {
  section?: string;
  placement: AdPlacementProps;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  console.log(placement, 'settt');
  const shouldQuery = Boolean(placement);

  const {data, isLoading} = useQuery({
    queryKey: ['bannerAds', placement],
    queryFn: () => adService.getBannerAds(placement, section),
    refetchInterval: 60000,
    enabled: shouldQuery,
  });

  console.log(data, 'banner ads');

  const ads = data?.ads ?? [];

  // 🔄 Rotate locally every 10s (only if ads.length > 0)
  useEffect(() => {
    if (!ads.length) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % ads.length);
        setFade(true);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (isLoading || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div className="p-4 border-b border-app-border">
      <BannerAd ad={currentAd} key={currentAd._id} animation={fade} />
    </div>
  );
}
function BannerAds({
  section,
  placement,
}: {
  section?: string;
  placement: AdPlacementProps;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // console.log(section, 'settt');
  // const shouldQuery = Boolean(placement);

  // const {data, isLoading} = useQuery({
  //   queryKey: ['bannerAds', placement],
  //   queryFn: () => adService.getBannerAds(placement, section),
  //   // refetchInterval: 60000,
  //   refetchInterval: 30000,
  //   enabled: shouldQuery,
  // });

  // console.log(data, 'banner ads');

  // // Local rotation every 15s

  // if (isLoading) return null;
  // if (!data?.ads.length) return null;

  // const currentAd = data.ads[0]; // backend returns one ad at a time

  // console.log(currentAd, 'currentAdd');
  // return (
  //   <div className="p-4 border-b border-app-border">
  //     <BannerAd ad={currentAd} key={currentAd._id} animation={fade} />
  //   </div>
  // );

  return null;
}

export default React.memo(BannerAds);
