import {AdPlacementProps} from '@/types/ad-types';

import api from '@/lib/client/api';

export type CommentDto = {
  images?: File[];
  content: string;
  postId: string;
  quotedComment?: QuotedCommentProps | null;
};

export type UpdateCommentDto = {
  images?: File[];
  content: string;
  postId: string;
  commentId: string;
  removedImageIds?: string[];
};
export interface QuotedCommentProps {
  quotedContent: string;
  quotedUser: string;
  quotedUserImage?: string;
  quotedId: string;
  quotedUserId: string;
  quotedImage?: string[];
  quotedContentCreatedDate?: string;
}

class CommentService {
  async createCommentRequestAction(comment: CommentDto) {
    const formData = new FormData();

    formData.append('postId', comment.postId);
    formData.append('content', comment.content);
    if (comment.quotedComment) {
      formData.append('quotedComment', JSON.stringify(comment.quotedComment));
    }
    comment.images?.forEach((image: File) => {
      formData.append('images', image);
    });
    try {
      return await api.post('/comment', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }
  async getCommentFeeds(
    postId: string,
    page = 1,
    limit = 10,
    search?: string,
    pattern: string = '4, 9, 15',
    mode: string = 'pattern',
    placement: AdPlacementProps = 'details_feed',
  ) {
    const params: any = {page, limit, mode, placement};
    if (search) params.search = search;
    if (pattern) params.pattern = pattern;

    const response = await api.get(`/feeds/comments/${postId}`, {params});
    return response.data?.data;
  }

  //update comment
  async updateCommentRequestAction(comment: UpdateCommentDto) {
    const formData = new FormData();

    formData.append('postId', comment.postId);
    formData.append('content', comment.content);

    comment.images?.forEach((image: File) => {
      formData.append('images', image);
    });

    comment.removedImageIds?.forEach(id => {
      formData.append('removedImageIds', id);
    });
    try {
      return await api.patch(`/comment/update/${comment.commentId}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async likeCommentRequestAction(commentId: string) {
    const response = await api.patch(`/comment/${commentId}/like`);
    return response.data;
  }

  async dislikeCommentRequestAction(commentId: string) {
    const response = await api.patch(`/comment/${commentId}/dislike`);
    return response.data;
  }
}

export const commentService = new CommentService();
