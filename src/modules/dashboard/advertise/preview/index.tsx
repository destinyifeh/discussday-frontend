'use client';
import AdCard from '@/components/ad/ad-card';
import {BannerAd} from '@/components/ad/banner';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/toast';
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
import {adPriceFormatter} from '@/fixtures/ad';
import {useAdStore} from '@/hooks/stores/use-ad-store';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {DurationValue} from '@/types/ad-types';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useAdActions} from '../../actions/action-hooks/ad.action-hooks';

const AdSubmitMessage = () => {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Ad Submitted Successfully!</h2>
      <p className="text-muted-foreground mb-6">
        Your ad has been submitted for review. We'll notify you once it's
        approved and ready to run.
      </p>
      <div>
        <Button asChild className="bg-app hover:bg-app/90 text-white">
          <Link href="/advertise/ad-performance">
            View Status
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const AdPreviewPage = ({
  setIsPreviewPage,
}: {
  setIsPreviewPage: (isPreviewPage: boolean) => void;
}) => {
  const navigate = useRouter();
  const {previewAdData} = useAdStore(state => state);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdSubmitted, setIsAdSubmitted] = useState(false);
  const {currentUser} = useAuthStore(state => state);
  const {createAd, updateAd} = useAdActions();

  const handleSubmitForApproval = () => {
    setIsSubmitting(true);
    const payload = {
      ...previewAdData,
      price: adPriceFormatter(
        previewAdData.duration as DurationValue,
        previewAdData.plan,
      ),
      section:
        previewAdData.plan === 'enterprise'
          ? 'enterprise'
          : previewAdData.section.toLowerCase(),
    };
    console.log(payload, 'previewDataa');

    if (payload.adId) {
      updateAd.mutate(payload, {
        onSuccess(data, variables, context) {
          console.log(data, 'dataaaaAd');
          toast.success('Your advertisement has been updated for approval!');
          setIsAdSubmitted(true);
        },
        onError(error, variables, context) {
          toast.error('Oops! Something went wrong, please try again.');
        },
        onSettled(data, error, variables, context) {
          setIsSubmitting(false);
        },
      });
      return;
    }
    createAd.mutate(payload, {
      onSuccess(data, variables, context) {
        console.log(data, 'dataaaaAd');
        toast.success('Your advertisement has been submitted for approval!');
        setIsAdSubmitted(true);
      },
      onError(error, variables, context) {
        toast.error('Oops! Something went wrong, please try again.');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });

    //navigate.push('/advertise/ad-preview');
  };

  const adPrice = () => {
    const {duration, plan} = previewAdData;

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

    return PRICE_MAP[plan]?.[duration as DurationValue] ?? 0; // Return 0 or handle undefined cases
  };

  const handleBack = () => {
    setIsPreviewPage(false);
    // navigate.back();
  };
  const previewData = {
    ...previewAdData,
    owner: {
      avatar: currentUser?.avatar ?? '',
      username: currentUser?.username ?? '',
    },
  };

  return (
    <div className="pb-20">
      {isAdSubmitted && <AdSubmitMessage />}
      {!isAdSubmitted && (
        <div className="p-4">
          <div>
            <div className="mb-8">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
              <div className="">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold mb-4">Ad Preview</h3>

                  {previewAdData.type === 'banner' && (
                    <BannerAd ad={previewAdData} />
                  )}

                  {previewAdData.type === 'sponsored' && (
                    <AdCard ad={previewData} />
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold mb-4">Advertisement Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-app-hover p-3 rounded-lg border border-app-border dark:bg-background">
                  <span className="text-sm text-app-gray">Selected Plan</span>
                  <p className="font-medium capitalize">
                    {previewAdData.plan || 'None selected'}
                  </p>
                </div>
                <div className="bg-app-hover p-3 rounded-lg border border-app-border dark:bg-background">
                  <span className="text-sm text-app-gray">Ad Type</span>
                  <p className="font-medium capitalize">
                    {previewAdData.type || 'None selected'}
                  </p>
                </div>
                <div className="bg-app-hover p-3 rounded-lg border border-app-border dark:bg-background">
                  <span className="text-sm text-app-gray">Duration</span>
                  <p className="font-medium">
                    {previewAdData.duration + ' ' + 'Days'}
                  </p>
                </div>
                {previewAdData.section && (
                  <div className="bg-app-hover p-3 rounded-lg border border-app-border dark:bg-background">
                    <span className="text-sm text-app-gray">
                      Target {previewAdData.plan === 'basic' && 'Section'}
                    </span>
                    <p className="font-medium">
                      {previewAdData.section || 'Multiple sections'}
                    </p>
                  </div>
                )}
                <div className="bg-app-hover p-3 rounded-lg border border-app-border dark:bg-background">
                  <span className="text-sm text-app-gray">Price</span>
                  <p className="font-medium">
                    {adPriceFormatter(
                      previewAdData.duration as DurationValue,
                      previewAdData.plan,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}>
                Back
              </Button>
              <Button
                onClick={handleSubmitForApproval}
                disabled={isSubmitting}
                className="bg-app hover:bg-app/90 text-white">
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}{' '}
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
