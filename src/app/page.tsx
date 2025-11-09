import {DashboardLayout} from '@/components/layouts/dashboard';
import {Sections} from '@/constants/data';
import {APP_NAME} from '@/constants/settings';
import {HomePage} from '@/modules/dashboard/home';
import Script from 'next/script';

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: baseUrl,
    description:
      'Explore trending discussions across technology, entertainment, politics, business, and more.',
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo_blue.webp`,
      },
    },
    hasPart: Sections.map(section => ({
      '@type': 'CollectionPage',
      name: section,
      url: `${baseUrl}/${section.name.toLowerCase()}`,
    })),
  };
  return (
    <>
      <Script
        id="home-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />
      <DashboardLayout>
        <HomePage />
      </DashboardLayout>
    </>
  );
}
