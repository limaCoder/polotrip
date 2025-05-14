import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://polotrip.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          pt: 'https://polotrip.com/pt',
        },
      },
    },
    {
      url: 'https://polotrip.com/sign-in',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          pt: 'https://polotrip.com/pt/sign-in',
        },
      },
    },
  ];
}
