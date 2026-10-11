import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { ConfirmDialogProvider, fontVariables } from '@/shared/ui-kit';
import '@/shared/ui-kit/styles/tokens.scss';
import '@/app/styles/globals.css';

type RootLayoutProps = Readonly<{
    children: ReactNode;
}>;

export const metadata: Metadata = {
    title: 'Танцевальная студия',
    description: 'Запись на занятия и управление абонементами',
    manifest: '/favicons/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Студия',
    },
    icons: {
        icon: [
            { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: '/favicons/favicon-256x256.png',
    },
};

export const viewport: Viewport = {
    themeColor: '#00E676',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

const RootLayout = ({ children }: RootLayoutProps) => (
    <html lang="en" className={fontVariables}>
        <body>
            {children}

            <Toaster
                position="top-center"
                theme="dark"
                richColors
            />

            <ConfirmDialogProvider />
        </body>
    </html>
);

export default RootLayout;
