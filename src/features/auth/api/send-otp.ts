'use server';

import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { getSiteUrl } from '@/shared/lib/site-url';
import { getSendOtpError, type SendOtpParams, type SendOtpResult } from '../lib';

// Отправляем с сервера, чтобы браузер пользователя не ходил на supabase.co напрямую
export const sendOtp = async ({ email, shouldCreateUser, userData }: SendOtpParams): Promise<SendOtpResult> => {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: getSiteUrl('/auth/callback').toString(),
            shouldCreateUser,
            ...(userData ? { data: userData } : {}),
        },
    });

    if (error) return { ok: false, error: getSendOtpError(error.message) };

    return { ok: true };
};
