'use server';

import { revalidatePath } from 'next/cache';
import { getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { LESSON_PATHS, type CancelLessonResult } from '../lib';

type CancelLessonParams = {
    lessonId: string;
};

// Занятие не удаляется, а переводится в cancelled: записи остаются как есть, в календаре оно видно отменённым
export const cancelLesson = async ({ lessonId }: CancelLessonParams): Promise<CancelLessonResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('lessons')
        .update({ status: 'cancelled' })
        .eq('id', lessonId)
        .eq('status', 'scheduled')
        .select('id');

    if (error) return { ok: false, error: 'unknown' };
    if (data.length === 0) return { ok: false, error: 'lesson_unavailable' };

    LESSON_PATHS.forEach((path) => revalidatePath(path));

    return { ok: true };
};
