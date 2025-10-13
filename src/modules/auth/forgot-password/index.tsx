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
import {useMutation} from '@tanstack/react-query';
import Link from 'next/link';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {forgotPasswordRequestAction} from '../actions';

const formSchema = z.object({
  email: z.string().trim().email({message: 'Invalid email address'}),
});
type forgotFormData = z.infer<typeof formSchema>;

export const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {mutate: forgotPass} = useMutation({
    mutationFn: forgotPasswordRequestAction,
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
            <h1 className="text-3xl font-bold mb-4">Reset your password</h1>
            <p className="text-lg mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Simple password recovery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Secure reset process</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Quick account access</span>
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
                Reset your password
              </CardTitle>
              <CardDescription className="text-center">
                {emailSent
                  ? 'Check your inbox for the reset link'
                  : 'Enter your email to receive a password reset link'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailSent ? (
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
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-4">
                  <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                    Reset link sent! Check your email inbox.
                  </div>
                  <p>
                    Didn't receive an email? Check your spam folder or request
                    another link.
                  </p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="mt-4">
                    Send Another Link
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm dark:text-muted-foreground">
                  Remember your password?{' '}
                  <Link href="/login" className="text-app hover:underline">
                    Back to Sign in
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
