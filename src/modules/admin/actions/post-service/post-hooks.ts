'use client';

import {adminService} from '@/services/admin-service';
import {useMutation} from '@tanstack/react-query';

export const useAdminPostActions = () => {
  const closeComment = useMutation({
    mutationFn: adminService.onCloseComment,
  });

  const deletePost = useMutation({
    mutationFn: adminService.deletePost,
  });

  const promotePost = useMutation({
    mutationFn: adminService.promotePost,
  });

  const demotePost = useMutation({
    mutationFn: adminService.demotePost,
  });

  return {
    closePostCommentRequest: closeComment,
    deletePostRequest: deletePost,
    promotePost,
    demotePost,
  };
};
