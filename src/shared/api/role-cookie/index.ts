import type { NextRequest, NextResponse } from 'next/server';
import type { UserRole } from '@/shared/types';

export const ROLE_COOKIE_NAME = 'user_role';

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

// Роль в cookie нужна только proxy для быстрых редиректов. Доступ к данным защищает RLS по auth.uid()
export const ROLE_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SECONDS,
};

export const getRoleCookie = (request: NextRequest): UserRole | null => {
    const value = request.cookies.get(ROLE_COOKIE_NAME)?.value;
    return value === 'student' || value === 'teacher' ? value : null;
};

export const setRoleCookie = (role: UserRole, response: NextResponse) => {
    response.cookies.set(ROLE_COOKIE_NAME, role, ROLE_COOKIE_OPTIONS);
};
