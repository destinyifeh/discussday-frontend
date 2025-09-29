'use client';

import ScreenLoader from '@/components/feedbacks/screen-loader';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {AccountStatus} from '@/types/user.types';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {getGoogleUser} from '../../actions';

export const GoogleCallbackPage = () => {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);
  const {item} = useGlobalStore(state => state);

  const {
    isLoading,
    error,
    data: googleUser,
  } = useQuery({
    queryKey: ['google-user'],
    queryFn: () => getGoogleUser(),
    retry: false,
  });
  console.log({error, googleUser});
  console.log(googleUser, 'googleuserr');

  useEffect(() => {
    if (error) {
      toast.error('Oops! Something went wrong. Please log in again.');
      router.replace('/login');
      return;
    }
    if (
      googleUser?.status === AccountStatus.PENDING_USERNAME ||
      googleUser?.requireUsername
    ) {
      router.replace(`/set-username/${googleUser.userId}`);
      return;
    }

    if (googleUser) {
      setUser(googleUser.user);

      const storedNext = localStorage.getItem('nextRoute') as string;
      localStorage.removeItem('nextRoute');
      router.replace(storedNext);
    }
  }, [error, googleUser, router, setUser]);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return <ScreenLoader />;
};
