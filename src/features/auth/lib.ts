import type { EmailOtpType } from '@supabase/supabase-js';

export type SendOtpError = 'user_not_found' | 'already_registered' | 'invalid_email' | 'unknown';

export type SendOtpResult = { ok: true } | { ok: false; error: SendOtpError };

export const getSendOtpError = (message: string): SendOtpError => {
    if (message === 'Signups not allowed for otp') return 'user_not_found';
    if (message.includes('already registered')) return 'already_registered';
    if (message.includes('invalid') && message.includes('email')) return 'invalid_email';

    return 'unknown';
};

const AUTH_ERROR_MESSAGES: Partial<Record<SendOtpError, string>> = {
    user_not_found: 'Аккаунт не найден. Сначала зарегистрируйтесь.',
    already_registered: 'Этот email уже зарегистрирован. Войдите в аккаунт.',
    invalid_email: 'Некорректный email',
};

export const getAuthErrorMessage = (error: SendOtpError, fallback: string) =>
    AUTH_ERROR_MESSAGES[error] ?? fallback;

export const EMAIL_OTP_TYPES: EmailOtpType[] = ['email', 'signup', 'magiclink', 'invite', 'recovery', 'email_change'];

export const isEmailOtpType = (value: string | null | undefined): value is EmailOtpType =>
    EMAIL_OTP_TYPES.some((type) => type === value);

export type ConfirmEmailResult = { ok: false; error: 'invalid_link' | 'unknown' };

const CONFIRM_EMAIL_ERROR_MESSAGES: Record<ConfirmEmailResult['error'], string> = {
    invalid_link: 'Ссылка устарела или уже использована. Запросите новую.',
    unknown: 'Не удалось войти, попробуйте ещё раз',
};

export const getConfirmEmailErrorMessage = (error: ConfirmEmailResult['error']) =>
    CONFIRM_EMAIL_ERROR_MESSAGES[error];

export type LogoutResult = { ok: false; error: 'unknown' };

export const LOGOUT_ERROR_MESSAGE = 'Не удалось выйти, попробуйте позже';
