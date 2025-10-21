'use client';

import {userService} from '@/services/user-management';
import {useMutation} from '@tanstack/react-query';

export const useUserActions = () => {
  const sendMail = useMutation({
    mutationFn: userService.mailUser,
  });

  const MailUs = useMutation({
    mutationFn: userService.mailUs,
  });

  return {
    sendMail,
    MailUs,
  };
};
