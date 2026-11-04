/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import { NetworkOnly, Serwist, type PrecacheEntry, type SerwistGlobalConfig } from 'serwist';

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const AUTH_PAGES = ['/login', '/register'];

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // Auth-пути всегда идут в сеть: закэшированная /login или /auth/callback со старым бандлом ломает вход по magic link.
        // Правило стоит первым, потому что Serwist берёт первое совпавшее
        {
            matcher: ({ sameOrigin, url: { pathname } }) =>
                sameOrigin && (
                    AUTH_PAGES.includes(pathname) ||
                    pathname.startsWith('/auth/') ||
                    pathname.startsWith('/api/')
                ),
            handler: new NetworkOnly(),
        },
        ...defaultCache,
    ],
    fallbacks: {
        entries: [
            {
                url: '/offline',
                matcher: ({ request }) => request.destination === 'document',
            },
        ],
    },
});

serwist.addEventListeners();
