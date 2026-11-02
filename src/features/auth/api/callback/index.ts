import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { setRoleCookie } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { getSiteUrl } from '@/shared/lib/site-url';
import type { UserProfile } from '@/shared/types';
import { EMAIL_OTP_TYPES } from '../../lib';

type VerifyEmailLinkParams = {
    tokenHash: string | null;
    type: string | null;
    code: string | null;
};

const isEmailOtpType = (value: string | null): value is EmailOtpType =>
    EMAIL_OTP_TYPES.some((type) => type === value);

// Пускаем только на свои пути: '//evil.com' от SITE_URL дал бы чужой хост
const getSafeNext = (next: string | null) =>
    next?.startsWith('/') && !next.startsWith('//') ? next : '/';

// token_hash приходит из своего шаблона письма, code — из стандартного шаблона Supabase
const verifyEmailLink = async ({ tokenHash, type, code }: VerifyEmailLinkParams) => {
    const supabase = await createServerClient();

    if (tokenHash && isEmailOtpType(type)) {
        const { data } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        return { supabase, user: data.user };
    }

    if (code) {
        const { data } = await supabase.auth.exchangeCodeForSession(code);
        return { supabase, user: data.user };
    }

    return { supabase, user: null };
};

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const code = searchParams.get('code');
    const next = getSafeNext(searchParams.get('next'));

    if (!tokenHash && !code) {
        return NextResponse.redirect(getSiteUrl('/login?error=missing_code'));
    }

    const { supabase, user } = await verifyEmailLink({ tokenHash, type, code });

    if (!user) {
        return NextResponse.redirect(getSiteUrl('/login?error=invalid_code'));
    }

    const response = NextResponse.redirect(getSiteUrl(next));

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single<Pick<UserProfile, 'role'>>();

    // Если профиля нет, cookie не ставим: proxy возьмёт роль из БД сам
    if (profile) {
        setRoleCookie(profile.role, response);
    }

    return response;
};
