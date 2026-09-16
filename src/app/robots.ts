import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthghuru.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/auth/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: ['/article/', '/category/', '/research/', '/interviews/', '/latest'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
