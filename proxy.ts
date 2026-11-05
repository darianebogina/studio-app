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
         * - sw.js (самоуничтожающийся service worker — редирект на /login сорвал бы обновление старых SW у пользователей)
         * - favicon.ico, .png, .jpg, .jpeg, .gif, .svg, .webp (файлы)
         */
        '/((?!_next/static|_next/image|favicons/|sw\\.js|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
