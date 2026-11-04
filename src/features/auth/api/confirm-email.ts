'use server';

import { redirect } from 'next/navigation';
import { setRoleCookieServer } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import type { UserProfile } from '@/shared/types';
import { isEmailOtpType, type ConfirmEmailResult } from '../lib';

type ConfirmEmailParams = {
    tokenHash: string;
    type: string;
};

// Токен тратится только здесь, по POST от кнопки. GET-превью почтовых клиентов открывает страницу и ничего не сжигает
export const confirmEmail = async ({ tokenHash, type }: ConfirmEmailParams): Promise<ConfirmEmailResult> => {
    if (!isEmailOtpType(type)) return { ok: false, error: 'invalid_link' };

    const supabase = await createServerClient();

    const { data: { user }, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error || !user) return { ok: false, error: 'invalid_link' };

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
