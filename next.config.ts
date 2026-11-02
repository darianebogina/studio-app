import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
    // Оффлайн-страница не попадает в precache сама: это роут, а не файл билда
    additionalPrecacheEntries: [{ url: '/offline', revision: crypto.randomUUID() }],
    disable: process.env.NODE_ENV === 'development',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const nextConfig: NextConfig = {
    turbopack: {},
    experimental: {
        serverActions: {
            // Браузер шлёт Origin адреса прокси, а приложение видит хост vercel.app. Без этого Next отклонит Server Actions как CSRF
            allowedOrigins: siteUrl ? [new URL(siteUrl).host] : [],
        },
    },
};

export default withSerwist(nextConfig);
