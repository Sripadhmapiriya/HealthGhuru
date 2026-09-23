/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthghuru.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/latest`, lastModified: new Date(), changeFrequency: 'always', priority: 0.95 },
    { url: `${baseUrl}/category/cancer`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/heart`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/diabetes`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/womens-health`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/pediatrics`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/mental-health`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/fitness`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/category/nutrition`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/doctors`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/hospitals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/interviews`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/advertise`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    // Dynamic Article URLs
    const articles = await sql`
      SELECT slug, updated_at, published_at
      FROM content_items
      WHERE status = 'published' AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT 500
    `;

    const articleRoutes: MetadataRoute.Sitemap = articles.map((item: any) => ({
      url: `${baseUrl}/article/${item.slug}`,
      lastModified: new Date(item.updated_at || item.published_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Dynamic Doctor Interview URLs
    const interviews = await sql`
      SELECT slug, published_at
      FROM doctor_interviews
      ORDER BY published_at DESC
      LIMIT 50
    `;

    const interviewRoutes: MetadataRoute.Sitemap = interviews.map((item: any) => ({
      url: `${baseUrl}/interviews/${item.slug}`,
      lastModified: new Date(item.published_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

    return [...staticRoutes, ...articleRoutes, ...interviewRoutes];
  } catch (err) {
    console.error('Error building sitemap:', err);
    return staticRoutes;
  }
}
