'use client';

import type React from 'react';

import {PageHeader} from '@/components/app-headers';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {LoadingFeedback} from '@/components/feedbacks/loading-feedback';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {adService} from '@/services/ad-service';
import {useQuery} from '@tanstack/react-query';
import {CheckCircle, ShieldCheck} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {Fragment, useEffect, useState} from 'react';
import {useAdActions} from '../../actions/action-hooks/ad.action-hooks';

export const AdPaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const adId = params.id as string;
  const {currentUser} = useAuthStore(state => state);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {verifyAdPaymentRequest, initializeAdPaymentRequest} = useAdActions();
  const shouldQuery = !!adId;
  const {
    error,
    data: adData,
    status,
    refetch,
  } = useQuery({
    queryKey: ['get-ad-details-for-payment', adId],
    queryFn: () => adService.getAd(adId),
    retry: 1,
    enabled: shouldQuery,
  });
  console.log(adData, 'ad');

  useEffect(() => {
    if (adData) {
      setEmail(adData.owner.email);
      setAmount(adData.price);
      setUsername(adData.owner.username);
    }
  }, [adData]);

  const resetPaymentDetails = () => {
    setAmount('');
    setEmail('');
    setPhoneNumber('');
    setUsername('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      email: email,
      amount: amount,

      otherDetails: {
        phoneNumber: phoneNumber,
        adId: adData._id,
        ownerId: adData.owner._id,
        username: adData.owner.username,
        plan: adData.plan,
        price: adData.price,
        duration: adData.duration,
        title: adData.title,
      },
    };

    console.log(payload, 'adPayload');

    initializeAdPaymentRequest.mutate(payload, {
      onSuccess(response, variables, context) {
        const {data} = response?.data;
        if (data && data.authorization_url) {
          window.location.href = data.authorization_url;
          setIsSubmitting(false);
          return;
        }
        console.log(response, 'dataataAdPay');
        toast.error('An unexpected error occurred. Please try again.');
      },
      onError(error, variables, context) {
        console.log(error, 'aAdError');
        toast.error('An unexpected error occurred. Please try again.');
        setIsSubmitting(false);
      },
      onSettled(data, error, variables, context) {},
    });
  };

  if (status === 'pending') {
    return (
      <Fragment>
        <PageHeader title="Complete Payment" href="/" />
        <LoadingFeedback
          variant="page"
          submessage="Please wait"
          showIcon={false}
        />
      </Fragment>
    );
  }

  if (status === 'error') {
    return <ErrorFeedback showGoBack showRetry onRetry={refetch} />;
  }

  if (adData && adData.status !== 'approved') {
    return (
      <ErrorFeedback
        showGoBack
        showRetry={false}
        message="Payment is only allowed for approved ads."
      />
    );
  }

  return (
    <div>
      <PageHeader title="Complete Payment" href="/" />

      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="bg-app/10 border border-app/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-app font-medium mb-1">
                <CheckCircle className="h-5 w-5 text-app" />
                <h3>Your Ad Has Been Approved</h3>
              </div>
              <p className="text-sm text-app">
                Congratulations! Your ad "{adData.title}" has been approved and
                is ready to go live. Complete payment to start your campaign.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your ad campaign details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* <div className="flex justify-between">
                    <span className="text-sm">Ad Name:</span>
                    <span className="text-sm font-medium">
                      {adData.title}
                    </span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-sm">Ad Type:</span>
                    <span className="text-sm font-medium">{adData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Plan:</span>
                    <span className="text-sm font-medium">{adData.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="text-sm font-medium">
                      {adData.duration} days
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>{adData.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes:</span>
                    <span>₦0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{adData.price}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pay for Your Ad</CardTitle>
                  <CardDescription>
                    Review and complete your payment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            className="capitalize"
                            disabled
                            id="username"
                            placeholder="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            className="form-input"
                            disabled
                            id="email"
                            placeholder=""
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              disabled={false}
                              id="amount"
                              placeholder=""
                              value={amount}
                              onChange={e => setAmount(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone-number">Phone Number</Label>
                            <Input
                              className="form-input"
                              id="phone-number"
                              placeholder=""
                              value={phoneNumber}
                              onChange={e => setPhoneNumber(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center pt-2 text-sm text-app-gray">
                        <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                        <span>
                          Your payment information is encrypted and secure
                        </span>
                      </div>
                    </div>

                    <CardFooter className="flex justify-end pt-6 px-0">
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-app hover:bg-app/90 text-white"
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : `Pay ${adData.price}`}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
