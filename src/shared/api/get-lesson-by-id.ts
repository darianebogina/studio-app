import { createClient as createServerClient } from './supabase/server';
import type { Lesson } from '@/shared/types';

// Чужие индивы отсекает RLS — для них вернётся null
export const getLessonById = async (lessonId: string): Promise<Lesson | null> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .maybeSingle<Lesson>();

    return data;
};
