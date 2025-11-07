import {Sections} from '@/constants/data';
import type {MetadataRoute} from 'next';
type Post = {slug: string; section: string; slugId: string; updatedAt?: string};
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://discussday.com';
export const revalidate = 3600; // invalidate every hour
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Post[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/sitemap-posts`,
      {next: {revalidate: 3600}},
    );

    if (res.ok) {
      posts = await res.json();
    } else {
      console.error(
        'Failed to fetch posts for sitemap:',
        res.status,
        await res.text(),
      );
    }
  } catch (err) {
    console.error('Sitemap fetch error:', err);
  }

  return [
    // Static pages
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${APP_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/help-center`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    {
      url: `${APP_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    {
      url: `${APP_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/advertise`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Dynamic sections
    ...Sections.map((section: {name: string}) => ({
      url: `${APP_URL}/${section.name.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // Individual posts
    ...posts.map(
      (post: {
        slug: string;
        section: string;
        slugId: string;
        updatedAt?: string;
      }) => ({
        url: `${APP_URL}/${post.section.toLowerCase()}/${post.slugId}/${
          post.slug
        }`,
        lastModified: new Date(post.updatedAt || Date.now()),
        changeFrequency: 'daily' as const,
        priority: 0.6,
      }),
    ),
  ];
}
