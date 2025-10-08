'use client';

import {useMutation} from '@tanstack/react-query';
import {adService} from '../ad.actions';

export const useAdActions = () => {
  const createAd = useMutation({
    mutationFn: adService.createdAdRequest,
  });

  const updateAd = useMutation({
    mutationFn: adService.updateAdRequest,
  });

  const updateAdClicksRequest = useMutation({
    mutationFn: adService.updateAdCliks,
  });

  const verifyAdPaymentRequest = useMutation({
    mutationFn: adService.verifyAdPayment,
  });

  const initializeAdPaymentRequest = useMutation({
    mutationFn: adService.initializeAdPayment,
  });

  return {
    createAd,
    updateAdClicksRequest,
    initializeAdPaymentRequest,
    verifyAdPaymentRequest,
    updateAd,
  };
};
