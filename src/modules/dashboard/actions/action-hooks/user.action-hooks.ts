'use client';

import {useMutation} from '@tanstack/react-query';
import {userService} from '../user.actions';

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
