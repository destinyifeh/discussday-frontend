'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Shield, Target, TrendingUp, Users} from 'lucide-react';
import Link from 'next/link';

export const AdsInfoPage = () => {
  return (
    <div>
      <div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Advertising Information</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Learn about how advertising works on Discussday and our commitment
              to user experience.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Our Advertising Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  At Discussday, we believe advertising should be relevant,
                  respectful, and add value to your experience. We work with
                  advertisers who share our commitment to quality content and
                  community values.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-2xl">
                    <Target className="h-5 w-5 text-[#0A66C2]" />
                    Relevant Ads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="">
                    We use your interests and activity to show you ads that are
                    more likely to be relevant to you.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-2xl">
                    <Shield className="h-5 w-5 text-[#0A66C2]" />
                    Privacy Protected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="">
                    Your personal information is never sold to advertisers. We
                    maintain strict privacy standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-2xl">
                    <Users className="h-5 w-5 text-[#0A66C2]" />
                    Community First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="">
                    Ads are clearly labeled and designed to complement, not
                    disrupt, your community experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-2xl">
                    <TrendingUp className="h-5 w-5 text-[#0A66C2]" />
                    Quality Standards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="">
                    All ads are reviewed for quality and appropriateness before
                    being shown to our community.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Types of Ads on Discussday
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold">Sponsored Posts</h4>
                    <p>
                      Content created by advertisers that appears in your feed,
                      clearly marked as sponsored.
                    </p>
                  </div>
                  {/* <div>
                    <h4 className="font-bold">Banner Ads</h4>
                    <p>
                      Display advertisements that appear at the top or bottom of
                      pages.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold">Promoted Communities</h4>
                    <p>
                      Suggestions for communities that may interest you, some of
                      which are promoted.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold">Native Advertising</h4>
                    <p>
                      Ads that match the look and feel of regular content while
                      being clearly labeled.
                    </p>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  How We Target Ads
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We may use the following information to show you relevant ads:
                </p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>Communities you've joined or shown interest in</li>
                  <li>Posts you've liked, shared, or commented on</li>
                  <li>Your general location (city/region level)</li>
                  <li>Device and browser information</li>
                  <li>Time of day and day of week</li>
                </ul>
                <p className="mt-4">
                  We do not use private messages, personal information like your
                  real name or address, or sensitive categories for ad
                  targeting.
                </p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Your Ad Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You have control over your ad experience:</p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2 ">
                  <li>
                    <strong>Hide ads:</strong> You can hide specific ads you
                    don't want to see
                  </li>
                  <li>
                    <strong>Report ads:</strong> Report ads that violate our
                    policies
                  </li>
                  <li>
                    <strong>Ad preferences:</strong> Adjust your ad preferences
                    in settings
                  </li>
                  <li>
                    <strong>Opt out:</strong> Limit personalized advertising
                  </li>
                </ul>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Advertiser Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>All advertisers must comply with our guidelines:</p>
                <ul className="list-disc pl-6 mt-4 flex flex-col gap-2">
                  <li>No misleading or false claims</li>
                  <li>No inappropriate or offensive content</li>
                  <li>Respect for user privacy</li>
                  <li>Clear disclosure of sponsored content</li>
                  <li>Compliance with applicable laws and regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Questions or Concerns?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  If you have questions about advertising on Discussday or want
                  to report an ad, we're here to help.
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Button
                    asChild
                    className="text-white bg-app hover:bg-app/90 dark:bg-app/90 dark:hover:bg-app">
                    <Link href="/help-center">Ask a Question</Link>
                  </Button>
                  <Button variant="outline" asChild className="">
                    <Link href="/register" className="">
                      Advertise With Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
