'use client';

import {useState} from 'react';

import {PageHeader} from '@/components/app-headers';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import EmailMessageSkeleton from '@/components/skeleton/email-message-skeleton';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {InputMessage} from '@/modules/components/form-info';
import {userService} from '@/services/user-management';
import {MailUserDto} from '@/types/user.types';
import {zodResolver} from '@hookform/resolvers/zod';
import {useQuery} from '@tanstack/react-query';
import {AlertTriangle, Send} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useUserActions} from '../actions/action-hooks/user.action-hooks';

const formSchema = z.object({
  message: z
    .string()
    .trim()
    .min(3, {message: 'Message must be at least 3 characters'}),

  subject: z
    .string()
    .trim()
    .min(3, {message: 'Subject must be 3 or more characters long'}),
});

type emailFormData = z.infer<typeof formSchema>;

export const EmailMessage = () => {
  const {user} = useParams<{user: string}>();
  const {currentUser} = useAuthStore(state => state);
  const navigate = useRouter();
  const {sendMail} = useUserActions();
  const [isSending, setIsSending] = useState(false);
  console.log(user, 'my userr');

  const shouldQuery = !!user;
  const {
    isLoading,
    error,
    data: userData,
    refetch,
  } = useQuery({
    queryKey: ['user', user],
    queryFn: () => userService.getUserByUsername(user),
    retry: false,
    enabled: shouldQuery,
  });
  console.log(shouldQuery, 'should query', error);

  console.log(userData, 'should query dataa');

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    formState: {errors, isValid},
  } = useForm<emailFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  if (isLoading) {
    return <EmailMessageSkeleton />;
  }

  if (error?.message === 'User not found') {
    return <ErrorFeedback showGoBack message="User not found" />;
  }

  if (userData?.code !== '200') {
    return <ErrorFeedback showGoBack showRetry onRetry={refetch} />;
  }

  const {username, email} = userData.user;

  const [subject = '', message = ''] = watch(['subject', 'message']);

  const resetFormError = () => {
    clearErrors(['subject', 'message']);
  };

  const onSubmit = (data: emailFormData) => {
    console.log(data, 'email data');
    setIsSending(true);
    resetFormError();
    const payload: MailUserDto = {
      ...data,
      username: username,
      email: email,
      senderName: currentUser?.username ?? '',
      senderEmail: currentUser?.email ?? '',
    };

    console.log(payload, 'email payload');
    sendMail.mutate(payload, {
      onSuccess(data, variables, context) {
        reset();
        toast.success(
          `Your email was successfully sent to ${
            username.charAt(0).toUpperCase() + username.slice(1)
          } 🎉`,
        );
        setTimeout(() => {
          navigate.back();
        }, 500);
      },
      onError(error, variables, context) {
        toast.error(
          `Oops! We couldn’t send your email to ${
            username.charAt(0).toUpperCase() + username.slice(1)
          }. Please try again.`,
        );
      },
      onSettled(data, error, variables, context) {
        setIsSending(false);
      },
    });
  };

  return (
    <div>
      <PageHeader title={`Email ${username}`} />

      <div className="p-4">
        <div className="rounded-lg border p-4 border-app-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="to" className="block text-sm font-medium mb-1">
                To:
              </label>
              <Input
                id="to"
                value={`${username}`}
                disabled
                className="form-input capitalize"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Privacy Notice</h3>
                <p className="text-sm text-yellow-600">
                  Messages sent through this system are private and will only be
                  visible to you and the recipient. Please remember our
                  community guidelines still apply to private messages.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-1">
                Subject:
              </label>
              <Input
                className="form-input"
                id="subject"
                placeholder="Enter subject"
                value={subject}
                disabled={isSending}
                {...register('subject')}
              />
              <InputMessage field={subject} errorField={errors.subject} />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1">
                Message:
              </label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                disabled={isSending}
                className="min-h-[200px] resize-none form-input"
                {...register('message')}
              />
              <InputMessage field={message} errorField={errors.message} />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-app hover:bg-app/90 text-white"
                disabled={isSending || !isValid}>
                {isSending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
