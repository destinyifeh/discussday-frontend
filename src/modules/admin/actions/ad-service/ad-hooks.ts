'use client';

import {adminService} from '@/services/admin-service';
import {useMutation} from '@tanstack/react-query';

export const useAdminAdActions = () => {
  const approveAdRequest = useMutation({
    mutationFn: adminService.approveAd,
  });
  const activateAdRequest = useMutation({
    mutationFn: adminService.activateAd,
  });

  const rejectAdRequest = useMutation({
    mutationFn: adminService.rejectAd,
  });

  const deleteAdRequest = useMutation({
    mutationFn: adminService.deleteAd,
  });

  const pauseAdRequest = useMutation({
    mutationFn: adminService.pauseAd,
  });

  const resumeAdRequest = useMutation({
    mutationFn: adminService.resumeAd,
  });

  return {
    approveAdRequest,
    deleteAdRequest,
    rejectAdRequest,
    pauseAdRequest,
    activateAdRequest,
    resumeAdRequest,
  };
};
