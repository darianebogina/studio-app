// Сайт открывают через прокси на VPS, а приложение видит свой хост как vercel.app.
// Поэтому абсолютные URL строим только от публичного адреса, а не от request.url / nextUrl.origin
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export const getSiteUrl = (path: string) => new URL(path, SITE_URL);
