import {API_BASE_URL} from '@/constants/api-resources';
import {APP_NAME} from '@/constants/settings';
import {capitalizeName} from '@/lib/formatter';
import {PostDetailPage} from '@/modules/posts/post-detail';
import {Metadata} from 'next';
import Script from 'next/script';

type PageParams = {
  section: string;
  slugId: string;
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const {section, slugId, slug} = await params;

  const res = await fetch(`${API_BASE_URL}/posts/post-details/${slugId}`, {
    next: {revalidate: 60},
  });

  if (!res.ok) {
    return {
      title: 'Post not found',
      description: 'This post does not exist',
    };
  }

  const post = await res.json();

  const previewText = post?.content?.trim()
    ? post.content.length > 120
      ? `${post.content.slice(0, 120)}...`
      : post.content
    : 'Check out this post';

  const firstImage =
    post.images?.[0]?.secure_url ??
    `${process.env.NEXT_PUBLIC_APP_URL}/logo_blue.webp`;

  return {
    title: `${post.title} | ${capitalizeName(post.section)} | ${APP_NAME}`,
    description: previewText,
    openGraph: {
      description: `Join the discussion on ${APP_NAME} — read and share thoughts on "${post.title}".`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${section}/${slugId}/${slug}`,
      siteName: APP_NAME,
      images: [
        {
          url: firstImage,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: previewText,
      images: [firstImage],
    },
  };
}

export default async function Page({params}: {params: Promise<PageParams>}) {
  const {slug, slugId, section} = await params;

  const res = await fetch(`${API_BASE_URL}/posts/post-details/${slugId}`, {
    next: {revalidate: 60},
  });

  if (!res.ok) return <div>Post not found</div>;
  const post = await res.json();

  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${section}/${slugId}/${slug}`;
  const firstImage =
    post.images?.[0]?.secure_url ??
    `${process.env.NEXT_PUBLIC_APP_URL}/logo_blue.webp`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    image: [firstImage],
    author: {
      '@type': 'Person',
      name: post?.user?.username || 'Discussday User',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Discussday',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/logo_blue.webp`,
      },
    },
    // "datePublished": post.createdAt,
    //"dateModified": post.updatedAt || post.createdAt,
    description: post.content?.slice(0, 160) || '',
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />
      <PostDetailPage params={{slug, slugId, section}} />
    </>
  );
}
