'use client';

import {AppLogo} from '@/components/app-logo';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {setGoogleUserUsername} from '../actions';

const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {message: 'Username must be at least 3 characters.'})
    .max(20, {message: 'Username must not exceed 20 characters.'})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),
});
type usernameFormData = z.infer<typeof formSchema>;

type PageParams = {
  params: {
    userId: string;
  };
};

export const SetUsernamePage = ({params}: PageParams) => {
  const setUser = useAuthStore(s => s.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const {mutate: setupUser} = useMutation({
    mutationFn: setGoogleUserUsername,
  });

  const form = useForm<usernameFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    formState: {errors, isValid},
  } = form;

  const [username = ''] = watch(['username']);

  const resetFormError = () => {
    clearErrors(['username']);
  };

  const onSubmit = async (data: usernameFormData) => {
    setIsSubmitting(true);
    resetFormError();
    setupUser(data, {
      onSuccess(response) {
        console.log(response, 'respoo');
        setUser(response.user);
        reset();
        router.replace('/home');
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? {};
        console.log(data, 'error data');
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error('Failed to set username. Please try again.');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const errorHandler = (message: string) => {
    if (message === 'User not found') {
      setError('username', {
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
    toast.error(message || 'Oops! Something went wrong, please try again');
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="flex w-full md:max-w-4xl">
        <div className="hidden md:flex flex-1 items-center justify-center rounded-l-lg p-8 text-white bg-app/90 dark:bg-app">
          <div>
            <Link href="/">
              <AppLogo
                color="text-white"
                mdSize="md:text-4xl"
                center="text-left"
                title="Discussday Forum"
                mb="mb-4"
              />
            </Link>
            <h1 className="text-3xl font-bold mb-4">Set your username</h1>
            <p className="text-lg mb-6">
              Choose a unique username to represent you on the platform.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Unique identity in the community</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Easy to remember and share</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Required to complete your profile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:flex-1">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Link href="/">
                  <AppLogo color="text-app" mdSize="md:text-4xl" mb="0" />
                </Link>
              </div>
              <CardTitle className="text-2xl text-center">
                Set up your username
              </CardTitle>
              <CardDescription className="text-center">
                This will be your identity on the platform. Make it unique.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({field: {onChange, value}}) => (
                      <FormItem>
                        <FormLabel className="capitalize">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            onChange={onChange}
                            className="form-input"
                            value={value}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-app hover:bg-app/90 text-white"
                    disabled={isSubmitting || !isValid}>
                    {isSubmitting ? 'Saving...' : 'Set Username'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-app-gray">
                  Not ready now?{' '}
                  <Link href="/login" className="text-app hover:underline">
                    Return to Sign in
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
