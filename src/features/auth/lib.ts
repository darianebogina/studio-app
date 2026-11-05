import type { EmailOtpType } from '@supabase/supabase-js';

// Должно совпадать с Email OTP Length в Supabase (Authentication → Providers → Email)
export const OTP_LENGTH = 6;

export type SignUpUserData = {
    first_name: string;
    last_name: string;
    phone: string;
};

export type SendOtpParams = {
    email: string;
    shouldCreateUser: boolean;
    userData?: SignUpUserData;
};

export type SendOtpError = 'user_not_found' | 'already_registered' | 'invalid_email' | 'rate_limited' | 'unknown';

export type SendOtpResult = { ok: true } | { ok: false; error: SendOtpError };

export const getSendOtpError = (message: string): SendOtpError => {
    if (message === 'Signups not allowed for otp') return 'user_not_found';
    if (message.includes('already registered')) return 'already_registered';
    if (message.includes('invalid') && message.includes('email')) return 'invalid_email';
    if (message.includes('rate limit') || message.includes('For security purposes')) return 'rate_limited';

    return 'unknown';
};

const AUTH_ERROR_MESSAGES: Partial<Record<SendOtpError, string>> = {
    user_not_found: 'Аккаунт не найден. Сначала зарегистрируйтесь.',
    already_registered: 'Этот email уже зарегистрирован. Войдите в аккаунт.',
    invalid_email: 'Некорректный email',
    rate_limited: 'Код уже отправлен. Подождите минуту и попробуйте снова.',
};

export const getAuthErrorMessage = (error: SendOtpError, fallback: string) =>
    AUTH_ERROR_MESSAGES[error] ?? fallback;

export const EMAIL_OTP_TYPES: EmailOtpType[] = ['email', 'signup', 'magiclink', 'invite', 'recovery', 'email_change'];

export const isEmailOtpType = (value: string | null | undefined): value is EmailOtpType =>
    EMAIL_OTP_TYPES.some((type) => type === value);

export type VerifyCodeResult = { ok: false; error: 'invalid_code' | 'unknown' };

const VERIFY_CODE_ERROR_MESSAGES: Record<VerifyCodeResult['error'], string> = {
    invalid_code: 'Неверный или устаревший код. Проверьте письмо или запросите новый.',
    unknown: 'Не удалось войти, попробуйте ещё раз',
};

export const getVerifyCodeErrorMessage = (error: VerifyCodeResult['error']) =>
    VERIFY_CODE_ERROR_MESSAGES[error];

export type LogoutResult = { ok: false; error: 'unknown' };

export const LOGOUT_ERROR_MESSAGE = 'Не удалось выйти, попробуйте позже';
