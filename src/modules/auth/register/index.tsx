'use client';

import {CustomLogo} from '@/components/app-logo';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
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
import {GOOGLE_SIGNIN_URL} from '@/constants/api-resources';
import {InputLabel, InputMessage} from '@/modules/components/form-info';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {Camera} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {registerRequestAction} from '../actions';

const formSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, {message: 'Username must be at least 3 characters.'})
      .max(20, {message: 'Username must not exceed 20 characters.'})
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores.',
      }),
    //phone: z.string().min(11, {message: 'Must be 10 or more characters long'}),
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
    // .regex(/[0-9]/, {message: 'Password must contain at least one number'}),
    email: z.string().trim().email({message: 'Invalid email address'}),
    confirmPassword: z.string().trim(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords does not match',
    path: ['confirmPassword'], // This sets the error message on the `confirmPassword` field
  });

type signupFormData = z.infer<typeof formSchema>;
export const RegisterPage = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useRouter();
  const {mutate: createUser} = useMutation({
    mutationFn: registerRequestAction,
  });
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    formState: {errors, isValid},
  } = useForm<signupFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [username = '', email = '', password = '', confirmPassword] = watch([
    'username',
    'email',
    'password',
    'confirmPassword',
  ]);

  const resetFormError = () => {
    clearErrors(['username', 'email', 'password', 'confirmPassword']);
  };

  const handleRegister = async (data: signupFormData) => {
    console.log(data, 'dataaa');
    setIsSubmitting(true);
    resetFormError();
    const registerData = {
      ...data,
      avatar,
    };

    createUser(registerData, {
      onSuccess(data, variables, context) {
        console.log(data, 'success data');
        reset();
        setEmailSent(true);
        toast.info(
          'Verification link sent! Check your email to activate your account.',
        );
        //navigate.push('/login');
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? null;
        console.log(data, 'error data');
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error('Oops! Something went wrong, please try again');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const errorHandler = (message: string) => {
    if (message === 'Email is already in use') {
      setError('email', {
        type: 'server',
        message: message,
      });
      return;
    }
    if (message === 'Username is already taken') {
      setError('username', {
        type: 'server',
        message: message,
      });
      return;
    }
    toast.error(message);
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    window.location.href = GOOGLE_SIGNIN_URL;
  };

  const getInitials = () => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    console.log(file, 'filoo');
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setAvatar(file);

      const reader = new FileReader();
      reader.onload = e => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            <Link href="/">
              <CustomLogo logo="/logo_white.png" width={200} height={100} />
            </Link>
            <h1 className="text-3xl font-bold mb-4">Join our community</h1>
            <p className="text-lg mb-6">
              Create an account to start sharing your thoughts and connect with
              others.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Create and share posts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Connect with other users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Join topic-specific discussions</span>
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
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Enter your information to sign up
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailSent && (
                <>
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-gray-300"
                      onClick={handleGoogleRegister}
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
                        ? 'Signing up with Google...'
                        : 'Sign up with Google'}
                    </Button>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-app-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or sign up with email
                      </span>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="space-y-4">
                    {/* Profile Photo Upload */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          {profileImage ? (
                            <AvatarImage
                              src={profileImage}
                              alt="Profile preview"
                            />
                          ) : (
                            <AvatarFallback className="bg-app/20 text-app text-2xl">
                              {getInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <label
                          htmlFor="profilePhoto"
                          className="absolute bottom-0 right-0 cursor-pointer">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full h-8 w-8 bg-white border border-forum-border pointer-events-none"
                            asChild>
                            <div>
                              <Camera size={16} />
                              <span className="sr-only">
                                Upload profile photo
                              </span>
                            </div>
                          </Button>
                        </label>
                        <input
                          id="profilePhoto"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <label
                          htmlFor="profilePhoto"
                          className="text-sm text-app cursor-pointer hover:underline">
                          {profileImage
                            ? 'Change profile photo'
                            : 'Upload a profile photo'}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <InputLabel label="Email" htmlFor="email" />
                      <Input
                        disabled={isSubmitting}
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Johndoe@mail.com"
                        className="form-input"
                        required
                        {...register('email')}
                      />
                      <InputMessage field={email} errorField={errors.email} />
                    </div>

                    <div className="space-y-2">
                      <InputLabel label="Username" htmlFor="username" />

                      <Input
                        disabled={isSubmitting}
                        id="username"
                        type="text"
                        value={username}
                        placeholder="johndoe"
                        autoComplete="username"
                        className="form-input"
                        required
                        {...register('username')}
                      />

                      <InputMessage
                        field={username}
                        errorField={errors.username}
                      />
                    </div>

                    <div className="space-y-2">
                      <InputLabel label="Password" htmlFor="password" />

                      <Input
                        disabled={isSubmitting}
                        id="password"
                        type="password"
                        value={password}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="form-input"
                        required
                        {...register('password')}
                      />
                      <InputMessage
                        field={password}
                        errorField={errors.password}
                      />
                    </div>

                    <div className="space-y-2">
                      <InputLabel
                        label="Confirm Password"
                        htmlFor="confirmPassword"
                      />

                      <Input
                        disabled={isSubmitting}
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="form-input"
                        required
                        {...register('confirmPassword')}
                      />
                      <InputMessage
                        field={confirmPassword}
                        errorField={errors.confirmPassword}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-app hover:bg-app/90 text-white"
                      disabled={isSubmitting || !isValid}>
                      {isSubmitting ? 'Creating account...' : 'Sign up'}
                    </Button>
                  </form>
                </>
              )}
              {emailSent && <VerifyEmailSent />}
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm dark:text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-app hover:underline">
                    Sign in
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

const VerifyEmailSent = () => {
  const navigate = useRouter();
  return (
    <div className="text-center p-4">
      <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
        Verification link sent! Check your email inbox.
      </div>
      <p>
        Didn't receive an email? Check your spam folder or request another link.
      </p>
      <Button
        onClick={() => navigate.push('/verify-email')}
        variant="outline"
        className="mt-4">
        Send Another Link
      </Button>
    </div>
  );
};
