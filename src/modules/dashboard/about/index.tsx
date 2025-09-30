'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Globe, Heart, Target, Users} from 'lucide-react';
import Link from 'next/link';

export const AboutPage = () => {
  return (
    <div>
      <div className="">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">About Discussday</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Building the future of online discussions with meaningful
              conversations and authentic connections.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-[#0A66C2]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                At Discussday, we believe in the power of meaningful
                conversations to bring people together, share knowledge, and
                build communities. Our platform is designed to foster respectful
                dialogue, encourage diverse perspectives, and create a space
                where everyone's voice matters.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#0A66C2]" />
                  Community First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="">
                  We prioritize building strong, supportive communities where
                  members feel valued and heard.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[#0A66C2]" />
                  Respect & Inclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="">
                  We foster an environment of mutual respect where diverse
                  perspectives are welcomed and celebrated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#0A66C2]" />
                  Global Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="">
                  Connecting people from around the world to share knowledge and
                  experiences across cultures.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0A66C2]" />
                  Quality Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="">
                  Promoting high-quality discussions and content that adds value
                  to our community.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Discussday is built by a passionate team of developers,
                designers, and community managers who are committed to creating
                the best possible experience for our users.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <p className="text-sm">CEO & Founder</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Mike Chen</h3>
                  <p className="text-sm ">CTO</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Emily Rodriguez</h3>
                  <p className="text-sm ">Head of Community</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Contact Section */}
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Have questions or want to learn more about Discussday? We'd love
                to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="text-white bg-app hover:bg-app/90 dark:bg-app/90 dark:hover:bg-app">
                  <Link href="/help-center">Ask a Question</Link>
                </Button>
                {/* <Button variant="outline" asChild>
                  <Link href="/careers">Join Our Team</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
