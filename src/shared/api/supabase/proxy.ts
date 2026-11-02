import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSiteUrl } from '@/shared/lib/site-url';
import type { UserProfile } from '@/shared/types';
import { getRoleCookie, setRoleCookie } from '../role-cookie';

// Публичные роуты (не требуют логина)
const PUBLIC_PATHS = ['/login', '/register', '/auth/callback', '/offline'];
const GUEST_ONLY_PATHS = ['/login', '/register'];
const TEACHER_PATHS = ['/teacher'];
const STUDENT_PATHS = ['/home', '/calendar', '/bookings'];

const matchesPath = (pathname: string, paths: string[]) =>
    paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

const redirectTo = (pathname: string) => NextResponse.redirect(getSiteUrl(pathname));

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
        return redirectTo('/login');
    }

    // Залогинен и идёт на страницу входа/регистрации → на главную
    if (user && isGuestOnlyPath) {
        return redirectTo('/');
    }

    const isTeacherPath = matchesPath(pathname, TEACHER_PATHS);
    const isStudentPath = matchesPath(pathname, STUDENT_PATHS);

    if (!user || (!isTeacherPath && !isStudentPath)) {
        return supabaseResponse;
    }

    const cachedRole = getRoleCookie(request);

    // Cookie с ролью ставится при входе. Если её нет (сессия старше cookie), берём роль из БД один раз и кэшируем
    const role = cachedRole ?? (
        await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single<Pick<UserProfile, 'role'>>()
    ).data?.role;

    if (role && !cachedRole) {
        setRoleCookie(role, supabaseResponse);
    }

    const isTeacher = role === 'teacher';

    // Не преподаватель идёт в кабинет преподавателя → в кабинет ученика
    if (isTeacherPath && !isTeacher) {
        return redirectTo('/home');
    }

    // Преподаватель идёт на страницы ученика → в свой кабинет
    if (isStudentPath && isTeacher) {
        return redirectTo('/teacher');
    }

    return supabaseResponse;
};
