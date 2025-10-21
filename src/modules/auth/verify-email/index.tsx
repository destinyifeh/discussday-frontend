'use client';

import {CustomLogo} from '@/components/app-logo';
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
import {toast} from '@/components/ui/toast';
import {EMAIL_VERIFICATION_ERROR} from '@/constants/api-resources';
import {InputLabel, InputMessage} from '@/modules/components/form-info';
import {authService} from '@/services/auth-service';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const formSchema = z.object({
  email: z.string().trim().email({message: 'Invalid email address'}),
});
type verifyFormData = z.infer<typeof formSchema>;

export const VerifyEmailPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {mutate: resendVerificationLink} = useMutation({
    mutationFn: authService.resendEmailVerificationLinkRequestAction,
  });

  const searchParams = useSearchParams();
  const navigate = useRouter();
  const token = searchParams.get('token');
  const reason = searchParams.get('reason');
  const emailFromQuery = searchParams.get('email');
  const {isLoading, isError, isSuccess, data, error, refetch} = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: () => authService.emailVerificationRequestAction(token),
    enabled: !!token,
    retry: false,
  });

  console.log(data, 'my dataa', error);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    setValue,
    formState: {errors, isValid},
  } = useForm<verifyFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (cooldown > 0) {
      const id = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [cooldown]);

  useEffect(() => {
    if (isSuccess && data?.code === '200') {
      toast.success('Email verified! You can now sign in.');
      navigate.replace('/login');
    }
  }, [isSuccess, data, navigate]);

  useEffect(() => {
    if (reason === 'unverified') {
      setEmailSent(true);
      setValue('email', emailFromQuery as string);
      toast.warning(
        'Your email is not verified. Please check your inbox to verify your account.',
      );
    }
  }, [reason, emailFromQuery]);

  if (token && isLoading) {
    return (
      <LoadingFeedback
        variant="page"
        message="Please wait..."
        submessage="Verifying your email"
        showIcon={false}
      />
    );
  }
  const verificationErr = error?.message === EMAIL_VERIFICATION_ERROR;
  if (isError && !verificationErr) {
    return (
      <ErrorFeedback
        showRetry
        onRetry={refetch}
        message="We encountered an unexpected error. Please try again"
        variant="detailed"
      />
    );
  }

  const [email = ''] = watch(['email']);

  const resetFormError = () => {
    clearErrors(['email']);
  };

  const onSubmit = async (data: verifyFormData) => {
    setIsSubmitting(true);
    resetFormError();
    resendVerificationLink(data, {
      onSuccess(response) {
        setEmailSent(true);
        toast.success('Email verification link sent to your email');
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? {};
        console.log(data, 'error data');
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error(
          'Failed to send email verification link. Please try again.',
        );
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const handleResend = () => {
    setIsSubmitting(true);
    setEmailSent(false);
    const data = {
      email,
    };
    resendVerificationLink(data, {
      onSuccess(response) {
        setEmailSent(true);
        setCooldown(30);
        toast.success('Email verification link sent to your email');
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? {};
        console.log(data, 'error data');
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error(
          'Failed to send email verification link. Please try again.',
        );
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const errorHandler = (message: string) => {
    setError('email', {
      type: 'server',
      message: message,
    });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="flex w-full md:max-w-4xl">
        <div className="hidden md:flex flex-1 items-center justify-center rounded-l-lg p-8 text-white bg-app/90 dark:bg-app">
          <div>
            {/* <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-16 h-16 text-white mb-4">
                <g>
                  <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </g>
              </svg> */}
            <Link href="/" className="">
              <CustomLogo logo="/logo_white.png" width={200} height={100} />
            </Link>
            <h1 className="text-3xl font-bold mb-4">Verify your email</h1>
            <p className="text-lg mb-6">
              Please verify your email address to activate your account and
              ensure secure access.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Fast and easy verification</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Protects your account identity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>One-click email confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:flex-1">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <div className="flex justify-center mb-0">
                {/* <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-10 h-10 text-app">
                  <g>
                    <path
                      fill="currentColor"
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </g>
                </svg> */}
                <Link href="/" className="">
                  <CustomLogo logo="/logo_blue.png" width={200} height={100} />
                </Link>
              </div>
              <CardTitle className="text-2xl text-center">
                Verify your email
              </CardTitle>

              <CardDescription className="text-center">
                {emailSent
                  ? 'Check your inbox for the verification link'
                  : 'Enter your email to receive a email verification link'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailSent && !isError && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <InputLabel label="Email address" htmlFor="email" />
                    <Input
                      id="email"
                      type="email"
                      disabled={isSubmitting}
                      value={email}
                      placeholder="name@example.com"
                      className="form-input"
                      required
                      {...register('email')}
                    />
                    <InputMessage field={email} errorField={errors.email} />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-app hover:bg-app/90 text-white"
                    disabled={isSubmitting || !isValid}>
                    {isSubmitting ? 'Sending...' : 'Send Verification Link'}
                  </Button>
                </form>
              )}

              {emailSent && (
                <div className="text-center p-4">
                  <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                    Verification link sent! Check your email inbox.
                  </div>
                  <p>
                    Didn't receive an email? Check your spam folder or request
                    another link.
                  </p>
                  <Button
                    disabled={cooldown > 0 || isSubmitting}
                    onClick={handleResend}
                    variant="outline"
                    className="mt-4">
                    {cooldown > 0
                      ? `Try again in ${cooldown}s`
                      : 'Send Another Link'}
                  </Button>
                  {!reason && (
                    <div className="text-center">
                      <p className="text-sm dark:text-muted-foreground mt-4">
                        Entered the wrong email?{' '}
                        <button
                          disabled={cooldown > 0 || isSubmitting}
                          onClick={() => setEmailSent(false)}
                          className="underline text-app hover:underline cursor-pointer">
                          Change it
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              )}
              {isError && verificationErr && !emailSent && (
                <>
                  {!errors.email && <FailedEmailVerification />}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <InputLabel label="Email address" htmlFor="email" />
                      <Input
                        id="email"
                        type="email"
                        disabled={isSubmitting}
                        value={email}
                        placeholder="name@example.com"
                        className="form-input"
                        required
                        {...register('email')}
                      />
                      <InputMessage field={email} errorField={errors.email} />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-app hover:bg-app/90 text-white"
                      disabled={isSubmitting || !isValid}>
                      {isSubmitting ? 'Sending...' : 'Send Verification Link'}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm dark:text-muted-foreground">
                  Need help?{' '}
                  <Link
                    href="/help-center"
                    className="text-app hover:underline">
                    Contact support
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FailedEmailVerification = () => {
  return (
    <div className="text-center p-4">
      <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
        Verification Failed.
      </div>
      <p>
        The verification link may have expired or is invalid. Please request a
        new link to verify your email.
      </p>
    </div>
  );
};
