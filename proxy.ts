import type { NextRequest } from 'next/server';
import { updateSession } from '@/shared/api';

export const proxy = (request: NextRequest) => updateSession(request);

export const config = {
    matcher: [
        /*
         * Совпадает со всеми путями, кроме:
         * - _next/static (статика Next.js)
         * - _next/image (оптимизация картинок)
         * - favicons/ (иконки и manifest.json — браузер грузит манифест без cookies)
         * - sw.js, swe-worker-*.js (service worker — редирект на /login сорвал бы его регистрацию)
         * - favicon.ico, .png, .jpg, .jpeg, .gif, .svg, .webp (файлы)
         */
        '/((?!_next/static|_next/image|favicons/|sw\\.js|swe-worker-|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
