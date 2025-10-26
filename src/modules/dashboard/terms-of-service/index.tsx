'use client';

import {PageHeader} from '@/components/app-headers';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export const TermsOfServicePage = () => {
  return (
    <div>
      <PageHeader title="Terms of Service" />
      <div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: December 1, 2025</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  1. Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  By accessing and using Discussday, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do
                  not agree to abide by the above, please do not use this
                  service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  2. User Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  When you create an account with us, you must provide
                  information that is accurate, complete, and current at all
                  times. You are responsible for safeguarding the password and
                  for all activities that occur under your account.
                </p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>You must be at least 13 years old to use this service</li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account
                  </li>
                  <li>
                    You must notify us immediately of any unauthorized use of
                    your account
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  3. User Content
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Our service allows you to post, link, store, share and
                  otherwise make available certain information, text, graphics,
                  videos, or other material. You are responsible for the content
                  that you post to the service.
                </p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>You retain ownership of your content</li>
                  <li>
                    You grant us a license to use, display, and distribute your
                    content
                  </li>
                  <li>
                    You must not post illegal, harmful, or offensive content
                  </li>
                  <li>
                    We reserve the right to remove content that violates our
                    policies
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  4. Prohibited Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You may not use our service:</p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>
                    For any unlawful purpose or to solicit others to perform
                    unlawful acts
                  </li>
                  <li>
                    To violate any international, federal, provincial, or state
                    regulations, rules, laws, or local ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights
                    or the intellectual property rights of others
                  </li>
                  <li>
                    To harass, abuse, insult, harm, defame, slander, disparage,
                    intimidate, or discriminate
                  </li>
                  <li>To submit false or misleading information</li>
                  <li>
                    To upload or transmit viruses or any other type of malicious
                    code
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  5. Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the service, to
                  understand our practices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  6. Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  7. Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material, we
                  will try to provide at least 30 days notice prior to any new
                  terms taking effect.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  8. Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us at legal@discussday.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
