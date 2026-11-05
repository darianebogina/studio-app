import type { NextConfig } from 'next';

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

export default nextConfig;
