import api from '@/lib/client/api';
import {AdStatus} from '@/types/ad-types';
import {Role} from '@/types/user.types';

export interface AdminUserProps {
  _id: string;
  name: string;
  username: string;
  status: string;
  avatar?: string;
  postCount: number;
  email?: string;
  role: Role;
}

export interface AccountRestrictionPayloadProps {
  action: string;
  reason: string;
  period: string;
  userId: string;
}

class AdminUserService {
  async getAllUsersWithPostCount(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};
    if (search) params.search = search;

    const response = await api.get(`/admin/users`, {params});
    return response.data;
  }
  async getUserDistribution() {
    const response = await api.get(`/admin/user-distribution`);
    return response.data;
  }

  async getUserDistributionAndStats() {
    const response = await api.get(`/admin/user-distribution-and-stats`);
    return response.data;
  }

  async getUserStats() {
    const response = await api.get(`/admin/user-stats`);
    return response.data;
  }

  async accountRestrictionAction(payload: AccountRestrictionPayloadProps) {
    try {
      const response = await api.patch(
        `/admin/users/${payload.userId}/action`,
        payload,
      );
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async updateUserRole(payload: {userId: string; role: Role}) {
    try {
      const response = await api.patch(
        `/admin/update-role/${payload.userId}?role=${payload.role}`,
      );
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getSystemNotifications() {
    const response = await api.get(`/notifications/system-notifications`);
    return response.data;
  }

  async getAds(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};

    if (search) params.search = search;

    const response = await api.get(`/ad`, {params});
    return response.data?.data;
  }

  async approveAd(data: {adId: string; ownerId: string}) {
    const response = await api.patch(
      `/ad/${data.adId}/approve/${data.ownerId}`,
    );
    return response.data;
  }

  async activateAd(data: {adId: string; ownerId: string}) {
    const response = await api.patch(
      `/ad/${data.adId}/activate/${data.ownerId}`,
    );
    return response.data;
  }

  async getCountAdByStatus(status: AdStatus) {
    const response = await api.get(`/ad/count-by-status?status=${status}`);
    return response.data;
  }

  async rejectAd(data: {adId: string; reason: string; ownerId: string}) {
    const response = await api.patch(
      `/ad/${data.adId}/reject/${data.ownerId}`,
      {reason: data.reason},
    );
    return response.data;
  }

  async pauseAd(data: {adId: string; reason: string; ownerId: string}) {
    const response = await api.patch(`/ad/${data.adId}/pause/${data.ownerId}`, {
      reason: data.reason,
    });
    return response.data;
  }

  async resumeAd(adId: string) {
    const response = await api.patch(`/ad/${adId}/resume`);
    return response.data;
  }

  async deleteAd(adId: string) {
    const response = await api.delete(`/ad/${adId}delete`);
    return response.data;
  }

  async getPostsContent(
    page = 1,
    limit = 10,
    search?: string,
    section?: string,
  ) {
    const params: any = {page, limit};

    if (search) params.search = search;
    if (section) params.section = section;
    const response = await api.get(`/posts/posts-with-comment-count`, {params});
    return response.data?.data;
  }

  async onCloseComment(postId: string) {
    const response = await api.patch(`/posts/${postId}/close-comment`);
    return response.data;
  }

  async deletePost(postId: string) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  }

  async getSectionPostCommentStats() {
    const response = await api.get(`/admin/section-post-comment-stats`);
    return response.data;
  }

  async getPostStats() {
    const response = await api.get(`/admin/post-stats`);
    return response.data;
  }
  async promotePost(id: string) {
    const response = await api.post(`/posts/${id}/promote`);
    return response.data;
  }
  async demotePost(id: string) {
    const response = await api.post(`/posts/${id}/demote`);
    return response.data;
  }
}

export const adminService = new AdminUserService();
