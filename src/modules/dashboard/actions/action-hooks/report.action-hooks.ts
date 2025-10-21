'use client';

import {reportService} from '@/services/report-service';
import {useMutation} from '@tanstack/react-query';

export const useReportActions = () => {
  const reportUser = useMutation({
    mutationFn: reportService.reportUserRequest,
  });

  const reportAbuse = useMutation({
    mutationFn: reportService.reportAbuseRequest,
  });

  const reportComment = useMutation({
    mutationFn: reportService.reportCommentRequest,
  });
  const reportPost = useMutation({
    mutationFn: reportService.reportPostRequest,
  });

  const reportAd = useMutation({
    mutationFn: reportService.reportAdRequest,
  });

  const resolveReport = useMutation({
    mutationFn: reportService.resolveReport,
  });

  const issueWarning = useMutation({
    mutationFn: reportService.issueWarning,
  });

  return {
    reportAbuse,
    reportAd,
    reportComment,
    reportPost,
    reportUser,
    resolveReport,
    issueWarning,
  };
};
