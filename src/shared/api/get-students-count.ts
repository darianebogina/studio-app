import { createClient as createServerClient } from './supabase/server';

// head: true — считаем строки на стороне БД, сами строки не тянем
export const getStudentsCount = async () => {
    const supabase = await createServerClient();

    const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

    return count ?? 0;
};
