import { createClient as createServerClient } from './supabase/server';
import type { Lesson } from '@/shared/types';

type GetLessonsByRangeParams = {
    dateFrom: Date;
    dateTo: Date;
};

// Отменённые не фильтруем: в календаре они видны серыми, чтобы было понятно, куда делось занятие.
// Чужие индивы отсекает RLS.
export const getLessonsByRange = async ({
    dateFrom,
    dateTo,
}: GetLessonsByRangeParams): Promise<Lesson[]> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('lessons')
        .select('*')
        .gte('starts_at', dateFrom.toISOString())
        .lt('starts_at', dateTo.toISOString())
        .order('starts_at', { ascending: true })
        .overrideTypes<Lesson[], { merge: false }>();

    return data ?? [];
};
