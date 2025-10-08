import api from '@/lib/auth/api';
import {AdPlacementProps} from '@/types/ad-types';
import {AxiosResponse} from 'axios';
import {CreateAdDto} from '../advertise/dto/create-ad.dto';

class AdService {
  async createdAdRequest(data: CreateAdDto): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('price', data.price);
    formData.append('duration', data.duration);
    formData.append('plan', data.plan);
    formData.append('targetUrl', data.targetUrl);
    formData.append('callToAction', data.callToAction);
    formData.append('type', data.type);
    formData.append('title', data.title);

    if (data.image) {
      formData.append('image', data.image);
    }

    if (data.content) {
      formData.append('content', data.content);
    }
    if (data.section) {
      formData.append('section', data.section);
    }

    if (data.targetType) {
      formData.append('targetType', data.targetType);
    }

    if (data.whatsappNumber) {
      formData.append('whatsappNumber', data.whatsappNumber);
    }

    return await api.post('/ad', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  }

  async updateAdRequest(data: CreateAdDto): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('price', data.price);
    formData.append('duration', data.duration);
    formData.append('plan', data.plan);
    formData.append('targetUrl', data.targetUrl);
    formData.append('callToAction', data.callToAction);
    formData.append('type', data.type);
    formData.append('title', data.title);

    if (data.image) {
      formData.append('image', data.image);
    }

    if (data.content) {
      formData.append('content', data.content);
    }
    if (data.section) {
      formData.append('section', data.section);
    }

    if (data.targetType) {
      formData.append('targetType', data.targetType);
    }

    if (data.whatsappNumber) {
      formData.append('whatsappNumber', data.whatsappNumber);
    }
    if (data.removedImageId) {
      formData.append('removedImageId', data.removedImageId);
    }

    return await api.put(`/ad/${data.adId}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  }

  async getUserAdByStatus(
    page = 1,
    limit = 10,
    status: string = 'all',
    search?: string,
  ) {
    const params: any = {page, limit, status, search};

    if (search) params.search = search;
    const response = await api.get(`/ad/user-ads`, {params});
    return response.data?.data;
  }

  async updateAdImpressions(id: any): Promise<AxiosResponse> {
    return await api.post(`/ad/${id}/impressions`);
  }

  async updateAdCliks(id: string): Promise<AxiosResponse> {
    return await api.post(`/ad/${id}/clicks`);
  }
  async getAd(id: string) {
    try {
      const response = await api.get(`/ad/${id}`);
      return response.data?.ad;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async initializeAdPayment(data: any): Promise<AxiosResponse> {
    return await api.post(`/ad/initialize`, data);
  }

  async verifyAdPayment(reference: string) {
    const response = await api.get(`/ad/verify?reference=${reference}`);
    return response.data;
  }

  async getBannerAds(placement: AdPlacementProps, section?: string) {
    const params: any = {placement};

    if (section) params.section = section;
    try {
      const response = await api.get(`/ad/banner-ads`, {params});
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }
}

export const adService = new AdService();
