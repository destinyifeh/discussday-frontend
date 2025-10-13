'use client';

import {PageHeader} from '@/components/app-headers';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {guidelines} from '@/fixtures/c-guidelines';
import {Users} from 'lucide-react';
import Link from 'next/link';

export const CommunityGuidelines = () => {
  return (
    <div className="">
      <PageHeader title="Communnity Guidelines" />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Users className="mx-auto mb-6 h-16 w-16 text-app" />
            <h1 className="text-3xl font-bold mb-6">Community Guidelines</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Be respectful and kind to others. Keep discussions constructive.
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {guidelines.map((guideline, index) => {
              const IconComponent = guideline.icon;
              return (
                <Card key={guideline.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${guideline.color}`} />
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{guideline.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="text-white bg-app/90 border-app-dark-border hover:bg-app">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Help Us Build a Better Community
              </h2>
              <p className="mb-6 opacity-90">
                If you see content that violates these guidelines, please report
                it to help us maintain a safe and welcoming environment for
                everyone.
              </p>
              <div className="space-x-4">
                <Link href="/report">
                  <Button
                    variant="secondary"
                    className="dark:bg-white dark:text-black dark:hover:bg-white">
                    Report Content
                  </Button>
                </Link>
                <Link href="/contact-support">
                  <Button
                    variant="outline"
                    className="text-app border-white hover:bg-white hover:text-app dark:bg-white dark:hover:bg-white ">
                    Get Help
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
