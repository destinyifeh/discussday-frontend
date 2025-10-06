'use client';

import {Button} from '@/components/ui/button';
import {ArrowRight, CheckCircle} from 'lucide-react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';

export const AdPaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const shouldQuery = !!reference;

  // const {error, data, status, refetch} = useQuery({
  //   queryKey: ['verify-ad-payment', reference],
  //   queryFn: () => adService.verifyAdPayment(reference as string),
  //   retry: 1,
  //   enabled: shouldQuery,
  // });
  // console.log(data, 'verifyAd');

  // if (!reference) {
  //   return (
  //     <ErrorFeedback showGoBack message="The request could not be processed." />
  //   );
  // }

  // if (status === 'pending') {
  //   return (
  //     <LoadingFeedback
  //       variant="page"
  //       submessage="Please wait"
  //       showIcon={false}
  //     />
  //   );
  // }

  // if (status === 'error') {
  //   return <ErrorFeedback showGoBack showRetry onRetry={refetch} />;
  // }

  // const ad = data.ad.ad;

  return (
    <div className="">
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
          <p className="text-app-gray mb-6">
            Your ad campaign has been paid for and is now active. It will run
            for the selected duration.
          </p>
          {/* <div className="p-6 rounded-lg mb-6 text-left">
            <h3 className="font-medium mb-4">Campaign Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm"> */}
          {/* <div>
                <span className="font-medium">Campaign:</span> {ad.title}
              </div> */}
          {/* <div className="capitalize">
                <span className="font-medium">Ad Type:</span> {ad.type}
              </div>
              <div className="capitalize">
                <span className="font-medium">Plan:</span> {ad.plan}
              </div>
              <div className="capitalize">
                <span className="font-medium">Duration:</span> {ad.duration}{' '}
                days
              </div>
              <div className="capitalize">
                <span className="font-medium">Amount:</span> {ad.price}
              </div>
              <div>
                <span className="font-medium">Status:</span> Active
              </div>
            </div>
          </div> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-app hover:bg-app/90 text-white">
              <Link href="/advertise/ad-performance">
                View Ad Performance
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/advertise">Create Another Ad</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
