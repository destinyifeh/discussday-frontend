'use client';

import {commentService} from './../../services/comment-service';

import {postService} from '@/services/post-service';
import {useMutation} from '@tanstack/react-query';

export const usePostActions = () => {
  const create = useMutation({
    mutationFn: postService.createPostRequestAction,
  });

  const update = useMutation({
    mutationFn: postService.updatePostRequestAction,
  });

  const likePost = useMutation({
    mutationFn: postService.likePostRequestAction,
  });

  const bookmarkPost = useMutation({
    mutationFn: postService.bookmarkPostRequestAction,
  });

  const createComment = useMutation({
    mutationFn: commentService.createCommentRequestAction,
  });

  const updateComment = useMutation({
    mutationFn: commentService.updateCommentRequestAction,
  });

  const likeComment = useMutation({
    mutationFn: commentService.likeCommentRequestAction,
  });

  const dislikeComment = useMutation({
    mutationFn: commentService.dislikeCommentRequestAction,
  });

  return {
    createPostRequest: create,
    updatePostRequest: update,
    createComment: createComment,
    updateCommentRequest: updateComment,
    likePostRequest: likePost,
    bookmarkPostRequest: bookmarkPost,
    likeCommentRequest: likeComment,
    dislikeCommentRequest: dislikeComment,
  };
};
