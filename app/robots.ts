import type { MetadataRoute } from 'next';

const BASE_URL = process.env.APP_URL || 'https://deallink.co';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/creator/dashboard',
          '/business/dashboard',
          '/admin',
          '/api/',
          '/verify-email',
          '/reset-password',
          '/business/set-password',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
