import { cookies } from 'next/headers';
import { ROLE_COOKIE_NAME } from '.';

export const clearRoleCookieServer = async () => {
    const cookieStore = await cookies();
    cookieStore.delete(ROLE_COOKIE_NAME);
};
