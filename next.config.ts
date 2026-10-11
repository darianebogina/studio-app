import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
    // Оффлайн-страница не попадает в precache сама: это роут, а не файл билда
    additionalPrecacheEntries: [{ url: '/offline', revision: crypto.randomUUID() }],
    disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {};

export default withSerwist(nextConfig);
