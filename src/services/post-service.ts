import api from '@/lib/client/api';

import {SectionName} from '@/types/section';

export type PostDto = {
  images?: File[];
  content: string;
  title: string;
  section: SectionName;
};

export type UpdatePostDto = {
  images?: File[];
  content: string;
  title: string;
  section: SectionName;
  postId: string;
  removedImageIds?: string[];
};

class PostService {
  async createPostRequestAction(post: PostDto) {
    const formData = new FormData();

    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('section', post.section);

    post.images?.forEach((image: File) => {
      formData.append('images', image);
    });
    try {
      return await api.post('/posts', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async updatePostRequestAction(post: UpdatePostDto) {
    const formData = new FormData();

    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('section', post.section);

    post.images?.forEach((image: File) => {
      formData.append('images', image);
    });

    post.removedImageIds?.forEach(id => {
      formData.append('removedImageIds', id);
    });

    try {
      return await api.patch(`/posts/${post.postId}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getPosts(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};
    if (search) params.search = search;

    const response = await api.get(`/posts`, {params});
    return response.data?.data;
  }

  async getPostRequestAction(postId: string) {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getPostBySlugRequestAction(slug: string) {
    try {
      const response = await api.get(`/posts/details/${slug}`);
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getViewPostBySlugIdRequestAction(slugId: string) {
    try {
      const response = await api.get(`/posts/view-post-details/${slugId}`);
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getPostBySlugIdRequestAction(slugId: string) {
    try {
      const response = await api.get(`/posts/post-details/${slugId}`);
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getPostCommentsCountRequestAction(postId: string) {
    const response = await api.get(`/posts/comment-count/${postId}`);
    return response.data;
  }

  async likePostRequestAction(postId: string) {
    const response = await api.patch(`/posts/${postId}/like`);
    return response.data;
  }

  async bookmarkPostRequestAction(postId: string) {
    const response = await api.patch(`/posts/${postId}/bookmark`);
    return response.data;
  }

  async getRelatedPostRequestAction(postId: string) {
    const response = await api.get(`/posts/${postId}/related`);
    return response.data;
  }
}

export const postService = new PostService();
