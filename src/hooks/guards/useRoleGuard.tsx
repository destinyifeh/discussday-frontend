'use client';

import {Role, UserProps} from '@/types/user.types';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export function useRoleGuard(
  currentUser?: UserProps | null,
  allowedRoles: Role[] = [],
) {
  const navigate = useRouter();

  useEffect(() => {
    if (!currentUser) return;

    const isAllowed = allowedRoles.includes(currentUser.role);
    if (!isAllowed) {
      navigate.back();
    }
  }, [currentUser, allowedRoles, navigate]);
}

//use
//useRoleGuard(currentUser, [Role.ADMIN, Role.SUPER_ADMIN]);
