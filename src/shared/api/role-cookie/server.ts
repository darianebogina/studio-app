import { cookies } from 'next/headers';
import type { UserRole } from '@/shared/types';
import { ROLE_COOKIE_NAME, ROLE_COOKIE_OPTIONS } from '.';

export const setRoleCookieServer = async (role: UserRole) => {
    const cookieStore = await cookies();
    cookieStore.set(ROLE_COOKIE_NAME, role, ROLE_COOKIE_OPTIONS);
};

export const clearRoleCookieServer = async () => {
    const cookieStore = await cookies();
    cookieStore.delete(ROLE_COOKIE_NAME);
};
