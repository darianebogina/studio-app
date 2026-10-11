import { NextResponse, type NextRequest } from 'next/server';
import { setRoleCookie } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import type { UserProfile } from '@/shared/types';

export const GET = async (request: NextRequest) => {
    const { searchParams, origin } = request.nextUrl;
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=missing_code`);
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(`${origin}/login?error=invalid_code`);
    }

    const response = NextResponse.redirect(`${origin}${next}`);

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single<Pick<UserProfile, 'role'>>();

    // Если профиля нет, cookie не ставим: proxy возьмёт роль из БД сам
    if (profile) {
        setRoleCookie(profile.role, response);
    }

    return response;
};
