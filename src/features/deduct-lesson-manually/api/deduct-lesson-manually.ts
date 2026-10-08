'use server';

import { revalidatePath } from 'next/cache';
import { getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import type { LessonKind } from '@/shared/types';
import { DEDUCTION_NOTE, LESSON_KINDS, STUDENTS_PATH, type DeductResult } from '../lib';

type DeductLessonManuallyParams = {
    userId: string;
    lessonKind: LessonKind;
};

// Списание по FIFO и запись deduction в ledger делает deduct_lesson в одной транзакции, роль она проверяет сама.
// Проверка здесь — чтобы вернуть понятную ошибку, а не сырую ошибку rpc
export const deductLessonManually = async ({
    userId,
    lessonKind,
}: DeductLessonManuallyParams): Promise<DeductResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    if (!LESSON_KINDS.some(({ value }) => value === lessonKind)) return { ok: false, error: 'invalid_kind' };

    const supabase = await createServerClient();

    const { error } = await supabase.rpc('deduct_lesson', {
        p_user_id: userId,
        p_lesson_kind: lessonKind,
        p_lesson_id: null,
        p_note: DEDUCTION_NOTE,
    });

    if (error) return { ok: false, error: 'unknown' };

    revalidatePath(STUDENTS_PATH);
    revalidatePath(`${STUDENTS_PATH}/${userId}`);

    return { ok: true };
};
