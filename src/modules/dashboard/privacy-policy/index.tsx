'use client';

import {PageHeader} from '@/components/app-headers';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export const PrivacyPolicyPage = () => {
  return (
    <div>
      <PageHeader title="Privacy Policy" />
      <div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="">Last updated: December 1, 2025</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We collect information you provide directly to us, such as
                  when you:
                </p>
                <ul className="list-disc pl-6 mt-4 gap-2 flex flex-col">
                  <li>Create an account</li>
                  <li>Post content or comments</li>
                  <li>Send us messages or feedback</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="mt-4">This information may include:</p>
                <ul className="list-disc pl-6 mt-2 flex flex-col gap-2">
                  <li>Name and email address</li>
                  <li>Profile information</li>
                  <li>Posts, comments, and other content</li>
                  <li>Messages and communications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>
                    Communicate with you about products, services, and events
                  </li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>
                    Detect, investigate, and prevent fraudulent transactions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>
                    <strong>With your consent:</strong> We may share your
                    information with your consent
                  </li>
                  <li>
                    <strong>Service providers:</strong> We may share your
                    information with third-party service providers
                  </li>
                  <li>
                    <strong>Legal requirements:</strong> We may disclose your
                    information if required by law
                  </li>
                  <li>
                    <strong>Business transfers:</strong> Information may be
                    transferred in connection with a merger or acquisition
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We take reasonable measures to help protect your personal
                  information from loss, theft, misuse, unauthorized access,
                  disclosure, alteration, and destruction. However, no internet
                  or electronic storage system is 100% secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Cookies and Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We use cookies and similar tracking technologies to track
                  activity on our service and hold certain information. You can
                  instruct your browser to refuse all cookies or to indicate
                  when a cookie is being sent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Our service does not address anyone under the age of 13. We do
                  not knowingly collect personally identifiable information from
                  children under 13.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at privacy@discussday.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
