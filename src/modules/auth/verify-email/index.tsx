'use client';

import {CustomLogo} from '@/components/app-logo';
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
import {InputLabel, InputMessage} from '@/modules/components/form-info';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  emailVerificationRequestAction,
  forgotPasswordRequestAction,
  resendEmailVerificationLinkRequestAction,
} from '../actions';

const formSchema = z.object({
  email: z.string().trim().email({message: 'Invalid email address'}),
});
type forgotFormData = z.infer<typeof formSchema>;

export const VerifyEmailPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {mutate: forgotPass} = useMutation({
    mutationFn: forgotPasswordRequestAction,
  });
  const {mutate: resendVerificationLink} = useMutation({
    mutationFn: resendEmailVerificationLinkRequestAction,
  });

  const searchParams = useSearchParams();
  const navigate = useRouter();
  const token = searchParams.get('token');
  console.log(token, 'tokennman');

  const {isLoading, isError, isSuccess} = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: () => emailVerificationRequestAction(token),
    enabled: !!token,
    retry: false,
    // onSuccess: () => {
    //   // optional delay to show final success step
    //   setTimeout(() => navigate('/verify/success'), 1000);
    // },
  });

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    formState: {errors, isValid},
  } = useForm<forgotFormData>({
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

  const [email = ''] = watch(['email']);

  const resetFormError = () => {
    clearErrors(['email']);
  };

  const onSubmit = async (data: forgotFormData) => {
    console.log(data, 'dataaa');
    setIsSubmitting(true);
    resetFormError();
    forgotPass(data, {
      onSuccess(response) {
        console.log(response, 'respoo');
        setEmailSent(true);
        reset();
        toast.success('Password reset link sent to your email');
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? {};
        console.log(data, 'error data');
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error('Failed to send reset link. Please try again.');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const errorHandler = (message: string) => {
    if (message === 'User not found') {
      setError('email', {
        type: 'server',
        message: message,
      });
      return;
    }
    toast.error(message || 'Oops! Something went wrong, please try again');
  };

  if (token && isLoading) {
    return <VerifyingEmailScreenLoader />;
  }
  if (isSuccess) {
    setTimeout(() => navigate.replace('/login'), 1000);
    toast.success('Email verification successful');
    return;
  }

  const handleResend = () => {
    setIsSubmitting(true);
    setEmailSent(false);
    const data = {
      email,
    };

    resendVerificationLink(data, {
      onSuccess(response) {
        console.log(response, 'respoo');
        setEmailSent(true);
        reset();
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
    setCooldown(30);
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
                {isError ? (
                  ''
                ) : (
                  <>
                    {emailSent
                      ? 'Check your inbox for the verification link'
                      : 'Enter your email to receive a email verification link'}
                  </>
                )}
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
                    // disabled={cooldown > 0 || resend.isPending}
                    onClick={handleResend}
                    variant="outline"
                    className="mt-4">
                    Send Another Link
                    {/* {cooldown > 0 ? `Try again in ${cooldown}s` : 'Resend Verification Link'} */}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm dark:text-muted-foreground mt-4">
                      Entered the wrong email?{' '}
                      <button
                        onClick={() => setEmailSent(false)}
                        className="underline text-app hover:underline cursor-pointer">
                        Change it
                      </button>
                    </p>
                  </div>
                </div>
              )}
              {isError && !emailSent && (
                <FailedEmailVerification handleResend={handleResend} />
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm dark:text-muted-foreground">
                  Need help?{' '}
                  <Link href="/login" className="text-app hover:underline">
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

export const VerifyingEmailScreenLoader = () => {
  const steps = [
    'Securely checking your token',
    'Ensuring your account is valid',
    'Preparing your account access',
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    steps.forEach((_, index) => {
      const id = setTimeout(() => setCurrentStep(index + 1), index * 5000);
      timeouts.push(id);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="text-center max-w-md mx-auto mt-20">
      <div className="flex items-center justify-center mb-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-app"></div>
      </div>

      <h1 className="text-3xl font-bold mb-4">Verifying your email...</h1>

      <p className="text-lg mb-6 text-gray-300">
        Please wait while we confirm your verification link. This should only
        take a moment.
      </p>

      <div className="space-y-2 text-left">
        {steps.slice(0, currentStep).map((step, index) => (
          <div key={index} className="flex items-center gap-2 animate-fade-in">
            <span className="bg-white/20 p-1 rounded-full">✓</span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {currentStep === 3 && (
        <p className="text-sm text-gray-400 mt-8">
          Do not close this page — you’ll be redirected once verification is
          complete.
        </p>
      )}
    </div>
  );
};

const FailedEmailVerification = ({
  handleResend,
}: {
  handleResend: () => void;
}) => {
  return (
    <div className="text-center p-4">
      <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
        Verification Failed.
      </div>
      <p>
        The verification link may have expired or is invalid. Please request a
        new link to verify your email.
      </p>
      <Button onClick={handleResend} variant="outline" className="mt-4">
        Send Another Link
      </Button>
    </div>
  );
};
