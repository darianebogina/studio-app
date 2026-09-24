import { type NextRequest } from 'next/server';
import { updateSession } from '@/shared/api/supabase/proxy';

export const proxy = (request: NextRequest) => updateSession(request);

export const config = {
    matcher: [
        /*
         * Совпадает со всеми путями, кроме:
         * - _next/static (статика Next.js)
         * - _next/image (оптимизация картинок)
         * - favicon.ico, .png, .jpg, .jpeg, .gif, .svg, .webp (файлы)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
