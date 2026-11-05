'use server';

import { redirect } from 'next/navigation';
import { setRoleCookieServer } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import type { UserProfile } from '@/shared/types';
import type { VerifyCodeResult } from '../lib';

type VerifyCodeParams = {
    email: string;
    code: string;
};

// Сессия создаётся в том же браузере, где ввели email: с ссылкой из письма она оставалась во webview почтового клиента
export const verifyCode = async ({ email, code }: VerifyCodeParams): Promise<VerifyCodeResult> => {
    const supabase = await createServerClient();

    const { data: { user }, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error || !user) return { ok: false, error: 'invalid_code' };

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single<Pick<UserProfile, 'role'>>();

    // Если профиля нет, cookie не ставим: proxy возьмёт роль из БД сам
    if (profile) {
        await setRoleCookieServer(profile.role);
    }

    redirect('/');
};
