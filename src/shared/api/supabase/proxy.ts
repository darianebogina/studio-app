import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Публичные роуты (не требуют логина)
const publicPaths = ['/login', '/register', '/auth/callback'];
const guestOnlyPaths = ['/login', '/register'];

const redirectTo = (request: NextRequest, pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
};

export const updateSession = async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // ВАЖНО: не удалять этот getUser() — он и триггерит обновление сессии
    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
    const isGuestOnlyPath = guestOnlyPaths.includes(pathname);

    // Не залогинен и идёт на защищённую страницу → на логин
    if (!user && !isPublicPath) {
        return redirectTo(request, '/login');
    }

    // Залогинен и идёт на страницу входа/регистрации → на главную
    if (user && isGuestOnlyPath) {
        return redirectTo(request, '/');
    }

    return supabaseResponse;
};
