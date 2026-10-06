import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { UserProfile } from '@/shared/types';

// Публичные роуты (не требуют логина)
const PUBLIC_PATHS = ['/login', '/register', '/auth/callback'];
const GUEST_ONLY_PATHS = ['/login', '/register'];
const TEACHER_PATHS = ['/teacher'];
const STUDENT_PATHS = ['/home', '/calendar', '/bookings'];

const matchesPath = (pathname: string, paths: string[]) =>
    paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

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
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // ВАЖНО: не удалять этот getUser() — он и триггерит обновление сессии
    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    const isGuestOnlyPath = GUEST_ONLY_PATHS.includes(pathname);

    // Не залогинен и идёт на защищённую страницу → на логин
    if (!user && !isPublicPath) {
        return redirectTo(request, '/login');
    }

    // Залогинен и идёт на страницу входа/регистрации → на главную
    if (user && isGuestOnlyPath) {
        return redirectTo(request, '/');
    }

    const isTeacherPath = matchesPath(pathname, TEACHER_PATHS);
    const isStudentPath = matchesPath(pathname, STUDENT_PATHS);

    if (!user || (!isTeacherPath && !isStudentPath)) {
        return supabaseResponse;
    }

    // Роль запрашиваем только для ролевых разделов, чтобы не нагружать остальные запросы
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single<Pick<UserProfile, 'role'>>();

    const isTeacher = profile?.role === 'teacher';

    // Не преподаватель идёт в кабинет преподавателя → в кабинет ученика
    if (isTeacherPath && !isTeacher) {
        return redirectTo(request, '/home');
    }

    // Преподаватель идёт на страницы ученика → в свой кабинет
    if (isStudentPath && isTeacher) {
        return redirectTo(request, '/teacher');
    }

    return supabaseResponse;
};
