'use client';

import {useEffect, useRef, useState} from 'react';

import {PageHeader} from '@/components/app-headers';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {FILE_SIZE_LIMIT} from '@/constants/api-resources';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {UserProps} from '@/types/user.types';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {Camera, X} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {userService} from '../../actions/user.actions';

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {message: 'Username must be at least 3 characters.'})
    .max(20, {message: 'Username must not exceed 20 characters.'})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),
  bio: z.string().max(160, {
    message: 'Bio must not be longer than 160 characters.',
  }),
  location: z.string().max(30, {
    message: 'Location must not be longer than 30 characters.',
  }),
  website: z
    .string()
    .regex(
      /^((https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,})(\/.*)?$/i,
      'Please enter a valid URL.',
    )
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const EditProfilePage = () => {
  const {currentUser, setUser} = useAuthStore(state => state);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverAvatar, setCoverAvatar] = useState<File | null>(null);

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {mutate: updateUser} = useMutation({
    mutationFn: userService.updateUserRequestAction,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      bio: '',
      location: '',
      website: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username ?? '',
        bio: currentUser.bio ?? '',
        location: currentUser.location ?? '',
        website: currentUser.website ?? '',
      });
    }
  }, [currentUser, form]);

  const resetFormError = () => {
    form.clearErrors(['username', 'location', 'website', 'bio']);
  };

  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);
    resetFormError();

    const payload = {
      ...data,
      avatar: avatar,
      coverAvatar: coverAvatar,
    };
    console.log(payload, 'payloadrr');

    updateUser(payload, {
      onSuccess(response) {
        const {user} = response?.data ?? {};

        if (!user) {
          toast.error('Update failed: incomplete response');
          return;
        }
        const {bio, location, username, website, avatar, cover_avatar} = user;
        form.reset();
        const updatedUserData = {
          ...currentUser,
          bio: bio,
          location: location,
          username: username,
          website: website,
          avatar: avatar,
          cover_avatar: cover_avatar,
        };

        setUser(updatedUserData as UserProps);
        toast.success('Profile updated successfully');
        router.push(`/profile`);
      },
      onError(error: any, variables, context) {
        console.log(error, 'error');
        const {data} = error?.response ?? {};
        if (data?.message) {
          errorHandler(data.message);
          return;
        }
        toast.error('Oops! Something went wrong, please try again');
        setIsSubmitting(false);
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const errorHandler = (message: string) => {
    if (message === 'User not found') {
      form.setError('username', {
        type: 'server',
        message: message,
      });
      return;
    }
    if (message === 'Username is already in use') {
      form.setError('username', {
        type: 'server',
        message: message,
      });
    }
    toast.error(message);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > FILE_SIZE_LIMIT) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setCoverAvatar(file);

      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file, 'ava file');
      // Check file size (limit to 5MB)
      if (file.size > FILE_SIZE_LIMIT) {
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
      reader.onload = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const removeAvatarImage = () => {
    setAvatarImage(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  return (
    <div>
      <PageHeader title={'Edit Profile'} />

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-4">
          <div className="mb-6 relative">
            {/* Cover photo */}
            {/* <div className="h-32 rounded-lg mb-16 bg-app/20"></div> */}

            <div className="h-32 bg-app-hover rounded-lg mb-16 relative overflow-hidden">
              {currentUser?.cover_avatar || coverImage ? (
                <>
                  <img
                    src={coverImage ?? currentUser?.cover_avatar ?? undefined}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  {!currentUser?.cover_avatar && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                      <X size={16} />
                    </Button>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Avatar */}
            {/* <div className="absolute left-4 bottom-0 transform translate-y-1/2">
              <Avatar className="h-20 w-20 border-4 border-app-border">
                {currentUser?.avatar ||
                  (coverImage && (
                    <AvatarImage src={currentUser?.avatar || coverImage} />
                  ))}
                <AvatarFallback className="capitalize">
                  {currentUser?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div> */}

            <div className="absolute left-4 bottom-0 transform translate-y-1/2">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage
                    src={avatarImage ?? currentUser?.avatar ?? undefined}
                  />
                  <AvatarFallback className="capitalize text-app text-3xl">
                    {currentUser?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {avatarImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeAvatarImage}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                    <X size={12} />
                  </Button>
                )}
              </div>
            </div>

            {/* Upload buttons */}
            <div className="absolute right-4 bottom-4 flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
                ref={coverInputRef}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => coverInputRef.current?.click()}>
                {coverImage || currentUser?.cover_avatar
                  ? 'Change cover'
                  : 'Add cover'}
              </Button>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarImageUpload}
                className="hidden"
                ref={avatarInputRef}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}>
                {avatarImage ? 'Change avatar' : 'Change avatar'}
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-8">
              <FormField
                control={form.control}
                name="username"
                render={({field: {onChange, value}}) => (
                  <FormItem>
                    <FormLabel className="capitalize">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        onChange={onChange}
                        className="form-input"
                        value={value}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({field: {onChange, value}}) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none form-input"
                        value={value}
                        onChange={onChange}
                        maxLength={160}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      {value?.length || 0}/160 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({field: {onChange, value}}) => (
                  <FormItem>
                    <FormLabel className="capitalize">Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Where you're based"
                        value={value}
                        onChange={onChange}
                        className="form-input"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({field: {onChange, value}}) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your website URL"
                        value={value}
                        onChange={onChange}
                        className="form-input"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pb-8">
                <Button
                  type="button"
                  variant="outline"
                  className="border-app-border"
                  onClick={() =>
                    router.push(`/profile/${currentUser?.username}`)
                  }>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="border-app-border bg-app text-white hover:bg-app/90"
                  disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </div>
  );
};
