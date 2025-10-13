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
import {GOOGLE_SIGNIN_URL, SESSION_EXPIRED} from '@/constants/api-resources';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {InputLabel, InputMessage} from '@/modules/components/form-info';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {loginRequestAction} from '../actions';
const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, {message: 'Please enter username'})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),

  password: z.string().trim().min(1, {message: 'Please enter password'}),
});

type loginFormData = z.infer<typeof formSchema>;

export const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {setUser, sessionExpiredAction} = useAuthStore(state => state);
  const {setItem} = useGlobalStore(state => state);
  const router = useRouter();

  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/home';

  const sessionExpired = searchParams.get('reason');

  const {mutate: loginUser} = useMutation({
    mutationFn: loginRequestAction,
  });

  console.log(sessionExpired, 'sesExpired');

  useEffect(() => {
    if (sessionExpired && sessionExpired === SESSION_EXPIRED) {
      sessionExpiredAction();
    }
    setIsGoogleLoading(false);
  }, [sessionExpired]);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    formState: {errors, isValid},
  } = useForm<loginFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [username = '', password = ''] = watch(['username', 'password']);

  const resetFormError = () => {
    clearErrors(['username', 'password']);
  };

  const handleLogin = async (credentials: loginFormData) => {
    setIsSubmitting(true);
    resetFormError();

    loginUser(credentials, {
      onSuccess(response) {
        console.log(response, 'respoo');
        const {user} = response?.data ?? {};

        if (!user) {
          toast.error('Login failed: incomplete response');
          return;
        }

        setUser(user);
        setTimeout(() => {
          reset();
          toast.success('Login successful!');
          router.replace(next);
        }, 100);
      },
      onError(error: any, variables, context) {
        console.log(error, 'error');
        const {data} = error?.response ?? {};
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error('Oops! Something went wrong, please try again');
      },
      onSettled(data, error, variables, context) {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 100);
      },
    });
  };

  const errorHandler = (message: string) => {
    if (message === 'Incorrect password') {
      setError('password', {
        type: 'server',
        message: message,
      });
      return;
    }
    if (message === 'User not found' || message.startsWith('Your account')) {
      setError('username', {
        type: 'server',
        message: message,
      });
      return;
    }
    toast.error(message);
  };

  const handleGoogleLogin = async () => {
    localStorage.setItem('nextRoute', next);
    setIsGoogleLoading(true);
    window.location.href = GOOGLE_SIGNIN_URL;
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="flex w-full md:max-w-4xl">
        <div className="hidden md:flex flex-1 items-center justify-center rounded-l-lg p-8 text-white bg-app dark:bg-app/90">
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

            {/* <AppLogo
                color="text-white"
                mdSize="md:text-4xl"
                center="text-left"
                title="Discussday Forum"
                mb="mb-4"
              /> */}

            <Link href="/">
              <CustomLogo logo="/logo_white.png" width={200} height={100} />
            </Link>

            <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
            <p className="text-lg mb-6">
              Join the conversation on the world's most interactive forum
              platform.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Follow your interests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Hear what people are talking about</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Join the conversation</span>
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

                {/* <Link href="/">
                  <AppLogo color="text-app" mdSize="md:text-4xl" mb="mb-0" />
                </Link> */}

                <Link href="/" className="">
                  <CustomLogo logo="/logo_blue.png" width={200} height={100} />
                </Link>
              </div>
              <CardTitle className="text-2xl">Sign in to Forum</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <InputLabel label="Username" htmlFor="username" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    placeholder="johndoe"
                    autoComplete="username"
                    className="form-input"
                    required
                    disabled={isSubmitting}
                    {...register('username')}
                  />

                  <InputMessage field={username} errorField={errors.username} />
                </div>

                <div className="space-y-2">
                  <InputLabel label="Password" htmlFor="password" />
                  <Input
                    id="password"
                    type="password"
                    disabled={isSubmitting}
                    value={password}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="form-input"
                    required
                    {...register('password')}
                  />
                  <InputMessage field={password} errorField={errors.password} />
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-app hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-app hover:bg-app/90 text-white"
                  disabled={isSubmitting || !isValid}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-app-border " />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-gray-300"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.8 1.61-1.26 3.41-1.26 5.38s.46 3.77 1.26 5.38l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.08-1.95-4.81-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  {isGoogleLoading
                    ? 'Signing in with Google...'
                    : 'Sign in with Google'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-app-gray">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-app hover:underline">
                    Sign up
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
