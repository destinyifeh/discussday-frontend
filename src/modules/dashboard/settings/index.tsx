'use client';
import {PageHeader} from '@/components/app-headers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {ChangePasswordErrorMessages} from '@/constants/messages';
import {ALLOW_DEACTIVATION} from '@/constants/settings';
import {useAuthStore} from '@/hooks/stores/use-auth-store';

import {InputMessage} from '@/modules/components/form-info';
import {authService} from '@/services/auth-service';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {AlertTriangle, HelpCircle, Lock, Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const formSchema = z
  .object({
    currentPassword: z.string().trim(),

    password: z
      .string()
      .trim()
      .min(4, {message: 'Password must be 4 or more characters long'})
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
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

type changePasswordFormData = z.infer<typeof formSchema>;
export const SettingsPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {logout} = useAuthStore(state => state);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {theme, setTheme} = useTheme();
  const {currentUser} = useAuthStore(state => state);
  const {mutate: chagePass} = useMutation({
    mutationFn: authService.changePasswordRequestAction,
  });
  const {mutate: deleteAccount} = useMutation({
    mutationFn: authService.deleteUserRequest,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    formState: {errors, isValid},
  } = useForm<changePasswordFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
      currentPassword: '',
    },
  });

  if (!mounted) return null; // prevent SSR mismatch

  const [password, confirmPassword, currentPassword] = watch([
    'password',
    'confirmPassword',
    'currentPassword',
  ]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    // toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} mode activated`);
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
  };

  const handleChangePassword = async (data: changePasswordFormData) => {
    console.log(data, 'dataaa');
    setIsSubmitting(true);

    chagePass(data, {
      onSuccess(response) {
        console.log(response, 'respoo');
        reset();
        toast.success('Password has been reset successfully');
        logout();
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? {};
        console.log(data, 'error data');
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error('Failed to change password. Please try again.');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const errorHandler = (message: string | string[]) => {
    const messages = Array.isArray(message) ? message : [message];

    // 2  Look for the first message we recognise
    const matched = messages.find(msg =>
      ChangePasswordErrorMessages.includes(msg),
    );

    if (matched) {
      // If it’s a password‑specific error
      setError('password', {
        type: 'server',
        message: matched,
      });
      return;
    }
    if (message === 'Old password is incorrect') {
      setError('currentPassword', {
        type: 'server',
        message,
      });
      return;
    }
    const theMessage =
      message || 'Failed to change password. Please try again.';
    toast.error(theMessage as string);
  };
  const handleReportAbuse = () => {
    toast.success('Report submitted. Our team will review it shortly.');
  };

  const handleAccountDeletion = () => {
    setIsDeleting(true);

    deleteAccount(currentUser?._id as string, {
      onSuccess(response) {
        toast.success('Account deleted.');
        logout();
        setTimeout(() => {
          router.push('/login');
        }, 100);
      },
      onError(error: any, variables, context) {
        const {data} = error?.response ?? {};
        console.log(data, 'error data');
        toast.error(
          'Account could not be deleted due to a server error. Please try again in a few minutes.',
        );
      },
      onSettled(data, error, variables, context) {
        setShowDeleteDialog(false);
        setIsDeleting(false);
      },
    });
  };

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="divide-y divide-app-border">
        {/* Theme Settings */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">Appearance</h2>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>Dark Mode</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-app"
            />
          </div>

          {/* <div className="flex items-center justify-between py-2">
            <span>Notifications</span>
            <Switch
              className="data-[state=checked]:bg-app"
              checked={notifications}
              onCheckedChange={toggleNotifications}
            />
          </div> */}
        </div>

        {/* Password Change */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">Security</h2>

          <form
            onSubmit={handleSubmit(handleChangePassword)}
            className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <Input
                className="form-input"
                id="current-password"
                type="password"
                value={currentPassword}
                {...register('currentPassword')}
              />
              <InputMessage
                field={currentPassword}
                errorField={errors.currentPassword}
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                className="form-input"
                disabled={isSubmitting}
                value={password}
                {...register('password')}
              />
              <InputMessage field={password} errorField={errors.password} />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                className="form-input"
                value={confirmPassword}
                disabled={isSubmitting}
                {...register('confirmPassword')}
              />
              <InputMessage
                field={confirmPassword}
                errorField={errors.confirmPassword}
              />
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="bg-app hover:bg-app/90 text-white">
              <Lock className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Please wait...' : 'Change Password'}
            </Button>
          </form>
        </div>

        {/* Report Abuse */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">Support</h2>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full justify-start border-app-border"
              onClick={() => router.push('/help-center')}>
              <HelpCircle size={18} />
              Help Center
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-app-border dark:text-red-700 dark:hover:text-red-600 ">
                  <AlertTriangle size={18} />
                  Report Abuse
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Abuse</DialogTitle>
                  <DialogDescription>
                    Please provide details about why you're reporting. Our
                    moderation team will review your report.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium mb-1">
                    Reason for reporting:
                  </label>
                  <select
                    id="reason"
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md">
                    <option value="spam">Spam</option>
                    <option value="harassment">Harassment</option>
                    <option value="misinformation">Misinformation</option>
                    <option value="hate_speech">Hate speech</option>
                    <option value="other">Other</option>
                  </select>

                  <label
                    htmlFor="details"
                    className="block text-sm font-medium mb-1">
                    Details:
                  </label>
                  <Textarea
                    id="details"
                    placeholder="Please provide additional details..."
                    className="min-h-[100px] form-input"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <Button
                    onClick={handleReportAbuse}
                    className="dark:hover:bg-red dark:bg-red-700 text-white bg-red-600 hover:bg-red-700 ">
                    Submit Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Danger Zone */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-red-500">
            Danger Zone
          </h2>
          <div className="space-y-4">
            {ALLOW_DEACTIVATION && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Deactivate Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable your account
                    </p>
                  </div>
                  <AlertDialog
                    open={showDeactivateDialog}
                    onOpenChange={setShowDeactivateDialog}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-500 hover:bg-red-50">
                        Deactivate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to deactivate your account? This
                          will temporarily disable your account and hide your
                          profile from other users. You can reactivate it
                          anytime by logging back in.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600 dark:text-white">
                          Yes, Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete your account?
                      This action cannot be undone. All your posts, comments,
                      followers, and personal data will be permanently removed
                      from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      onClick={handleAccountDeletion}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 dark:text-white">
                      {isDeleting ? 'Deleting...' : 'Yes, Delete Forever'}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
