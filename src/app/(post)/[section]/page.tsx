import {APP_NAME} from '@/constants/settings';
import {capitalize} from '@/lib/formatter';
import {SectionPage} from '@/modules/posts/section';

import {Metadata} from 'next';
import Script from 'next/script';

type PageParams = {
  section: string;
};

export async function generateMetadata({params}: any): Promise<Metadata> {
  const {section} = await params;

  return {
    title: `${capitalize(section)} | ${APP_NAME}`,
    description: `${capitalize(section)} section`,
  };
}

export default async function Page({params}: {params: Promise<PageParams>}) {
  const {section} = await params;

  // Structured Data for this section page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${capitalize(section)} | ${APP_NAME}`,
    url: `https://discussday.com/${section.toLowerCase()}`,
    description: `${capitalize(section)} section of ${APP_NAME}`,
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: 'https://discussday.com/logo_blue.webp',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://discussday.com/${section.toLowerCase()}`,
    },
  };

  return (
    <>
      <Script
        id="section-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />
      <SectionPage />
    </>
  );
}
