'use client';

import type React from 'react';

import {PageHeader} from '@/components/app-headers';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {AlertTriangle, CheckCircle} from 'lucide-react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {useReportActions} from '../actions/action-hooks/report.action-hooks';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const {theme} = useGlobalStore(state => state);
  const contentId = searchParams.get('contentId');
  const contentType = searchParams.get('contentType') || 'report';
  const username = searchParams.get('username') || '';

  const [reportReason, setReportReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const {reportAbuse} = useReportActions();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the report to the server
    console.log('Report submitted:', {
      contentId,
      contentType,
      reportReason,
      details,
      email,
    });

    const payload = {
      reason: reportReason,
      note: details,
    };

    reportAbuse.mutate(payload, {
      onSuccess(data, variables, context) {
        console.log(data, 'report data');
        setSubmitted(true);
      },
      onError(error, variables, context) {
        console.log(error, 'post report err');

        toast.error(
          'Sorry, we were unable to submit your report. Please try again.',
        );
      },
    });
  };

  const getReportHeaderText = () => {
    if (contentType === 'post') return 'Report Post';
    if (contentType === 'comment') return 'Report Comment';
    if (contentType === 'user') return `Report User ${username}`;
    return 'Report Abuse';
  };

  return (
    <div className="pb-20">
      <PageHeader title="Report" />

      <div className="p-4 max-w-2xl mx-auto">
        {!submitted ? (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Please note</h3>
                <p className="text-sm text-yellow-600">
                  Reports are confidential and help us maintain community
                  standards. False reports may result in account restrictions.
                  Please provide accurate information.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">
                  {/* What is the issue with this {contentType}? */}
                  What is the issue?
                </Label>
                <RadioGroup
                  value={reportReason}
                  onValueChange={setReportReason}
                  className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="spam"
                      id="spam"
                      className="border-app text-app"
                    />
                    <Label htmlFor="spam" className="font-normal">
                      Spam or misleading content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="harassment"
                      id="harassment"
                      className="border-app text-app"
                    />
                    <Label htmlFor="harassment" className="font-normal">
                      Harassment or bullying
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="hate-speech"
                      id="hate-speech"
                      className="border-app text-app"
                    />
                    <Label htmlFor="hate-speech" className="font-normal">
                      Hate speech or discrimination
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="misinformation"
                      id="misinformation"
                      className="border-app text-app"
                    />
                    <Label htmlFor="misinformation" className="font-normal">
                      False information
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="violence"
                      id="violence"
                      className="border-app text-app"
                    />
                    <Label htmlFor="violence" className="font-normal">
                      Violence or threatening content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="copyright"
                      id="copyright"
                      className="border-app text-app"
                    />
                    <Label htmlFor="copyright" className="font-normal">
                      Copyright or intellectual property violation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="other"
                      id="other"
                      className="border-app text-app"
                    />
                    <Label htmlFor="other" className="font-normal">
                      Other
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Additional Details</Label>
                <Textarea
                  id="details"
                  placeholder="Please provide specific details about this report"
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="min-h-[150px] form-input"
                />
                <p className="text-xs text-muted-foreground">
                  Please be as specific as possible. Include relevant
                  information such as timestamps, examples, or context.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Your Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                />
                <p className="text-xs text-muted-foreground">
                  We may contact you for additional information if needed. Your
                  email won't be shared with the reported user.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-app hover:bg-app/90 text-white"
                  disabled={!reportReason}>
                  Submit Report
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-app/10 text-green-600 mb-4">
              <CheckCircle className="h-8 w-8" color="#0a66c2" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Report Submitted</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for helping to keep our community safe. Our moderation
              team will review your report and take appropriate action.
            </p>
            <Button asChild className="bg-app hover:bg-app/90 text-white">
              <Link href="/home">Return to Home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
