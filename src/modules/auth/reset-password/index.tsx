'use client';
import {useState} from 'react';

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
import {Eye, EyeOff} from 'lucide-react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {resetPasswordRequestAction} from '../actions';

const formSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(4, {message: 'Password must be 4 or more characters long'})
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: 'Password must contain at least one special character',
      }),

    confirmPassword: z.string().trim(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // This sets the error message on the `confirmPassword` field
  });

type resetFormData = z.infer<typeof formSchema>;

export const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useRouter();
  const location = useSearchParams();

  // In a real app, you would extract the token from the URL
  // For demo purposes, we're simulating a valid token
  const token = location.get('token') as string;
  console.log(token, 'tokennn');

  const {mutate: resetPass} = useMutation({
    mutationFn: resetPasswordRequestAction,
  });

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    formState: {errors, isValid},
  } = useForm<resetFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [password = '', confirmPassword] = watch([
    'password',
    'confirmPassword',
  ]);

  const resetFormError = () => {
    clearErrors(['password', 'confirmPassword']);
  };

  const onSubmit = async (data: resetFormData) => {
    console.log(data, 'dataaa');
    setIsSubmitting(true);
    resetFormError();
    const resetdata = {
      ...data,
      password: data.password,
      token: token,
    };

    resetPass(resetdata, {
      onSuccess(response) {
        console.log(response, 'respoo');
        reset();
        toast.success('Password has been reset successfully');
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? {};
        console.log(data, 'error data');
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error('Failed to reset password. Please try again.');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const errorHandler = (message: string) => {
    if (message === 'User not found') {
      setError('password', {
        type: 'server',
        message: message,
      });
      return;
    }
    toast.error(message || 'Failed to reset password. Please try again.');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="flex w-full md:max-w-4xl">
        <div className="hidden md:flex flex-1 bg-app items-center justify-center rounded-l-lg p-8 text-white">
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
            <Link href="/">
              <CustomLogo logo="/logo_white.png" width={200} height={100} />
            </Link>
            <h1 className="text-3xl font-bold mb-4">Create new password</h1>
            <p className="text-lg mb-6">
              Almost there! Enter your new password to secure your account.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Mix of letters and numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Special characters recommended</span>
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
                <Link href="/">
                  <CustomLogo logo="/logo_blue.png" width={200} height={100} />
                </Link>
              </div>
              <CardTitle className="text-2xl text-center">
                Create new password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your new password below to reset your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <InputLabel label="New Password" htmlFor="password" />
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className="form-input"
                      required
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  <InputMessage field={password} errorField={errors.password} />
                </div>

                <div className="space-y-2">
                  <InputLabel
                    label="Confirm New Password"
                    htmlFor="confirmPassword"
                  />
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      disabled={isSubmitting}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="form-input"
                      required
                      {...register('confirmPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  <InputMessage
                    field={confirmPassword}
                    errorField={errors.confirmPassword}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-app hover:bg-app/90 text-white"
                  disabled={isSubmitting || !isValid}>
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-app-gray">
                  Changed your mind?{' '}
                  <a href="/login" className="text-app hover:underline">
                    Back to Login
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
