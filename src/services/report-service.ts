import api from '@/lib/client/api';
import {AxiosResponse} from 'axios';

class ReportService {
  async reportUserRequest(data: {
    userId: string;
    reason: string;
    note?: string;
  }) {
    return await api.post(`/report/user/${data.userId}`, data);
  }

  async reportPostRequest(data: {
    postId: string;
    reason: string;
    note?: string;
  }): Promise<AxiosResponse> {
    return await api.post(`/report/post/${data.postId}`, data);
  }

  async reportCommentRequest(data: {
    commentId: string;
    reason: string;
    note?: string;
  }): Promise<AxiosResponse> {
    return await api.post(`/report/comment/${data.commentId}`, data);
  }

  async reportAdRequest(data: {
    adId: string;
    reason: string;
    note?: string;
  }): Promise<AxiosResponse> {
    return await api.post(`/report/post/${data.adId}`, data);
  }

  async reportAbuseRequest(data: {
    reason: string;
    note?: string;
  }): Promise<AxiosResponse> {
    return await api.post(`/report/abuse`, data);
  }

  async getReports(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};

    if (search) params.search = search;
    const response = await api.get(`/report`, {params});
    return response.data?.data;
  }

  async issueWarning(data: {
    message: string;
    userId: string;
  }): Promise<AxiosResponse> {
    return await api.post(`/report/${data.userId}/warn`, data);
  }

  async resolveReport(reportId: string): Promise<AxiosResponse> {
    return await api.delete(`/report/${reportId}/resolve`);
  }
}

export const reportService = new ReportService();
