'use client';
import {Role, UserProps} from '@/types/user.types';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export function useAdminGuard(currentUser?: UserProps | null) {
  const navigate = useRouter();

  useEffect(() => {
    // Only run when user is known
    if (!currentUser) return;

    const notAdmin =
      currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN;

    if (notAdmin) {
      navigate.back();
    }
  }, [currentUser, navigate]);
}
