import { createClient as createServerClient } from './supabase/server';
import type { UserProfile } from '@/shared/types';

export const getStudentById = async (id: string): Promise<UserProfile | null> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('role', 'student')
        .maybeSingle<UserProfile>();

    return data;
};
