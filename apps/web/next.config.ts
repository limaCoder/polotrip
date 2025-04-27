import { env } from '@/lib/env';
import createNextIntlPlugin from 'next-intl/plugin';
import { SizeLimit } from 'next';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb' as SizeLimit,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: '*.googleusercontent.com',
      },
      {
        hostname: '*.stripe.com',
      },
      {
        hostname: '*.stripe.network',
      },
      {
        hostname: '*.supabase.co',
      },
      {
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
