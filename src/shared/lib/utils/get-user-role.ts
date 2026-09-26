import {createClient as createServerClient} from '@/shared/api/supabase/server';
import type { UserProfile } from '@/shared/types';

export const getUserRole = async (): Promise<UserProfile | null> => {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single<UserProfile>();

    return profile;
};