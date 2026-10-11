'use server';

import { redirect } from 'next/navigation';
import { clearRoleCookieServer } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import type { LogoutResult } from '../lib';

export const logout = async (): Promise<LogoutResult> => {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, error: 'unknown' };

    await clearRoleCookieServer();
    redirect('/login');
};
