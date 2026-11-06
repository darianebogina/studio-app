'use server';

import { revalidatePath } from 'next/cache';
import { getBookingById, getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { REMOVE_STUDENT_PATHS, type RemoveStudentResult } from '../lib';

type RemoveStudentFromLessonParams = {
    bookingId: string;
};

// Запись не удаляется, а переводится в cancelled: так её можно вернуть через «Добавить ученика»
// (unique (lesson_id, user_id) не даст создать новую). Отмеченную запись не трогаем:
// по ней уже списано занятие, его возвращает только снятие отметки
export const removeStudentFromLesson = async ({
    bookingId,
}: RemoveStudentFromLessonParams): Promise<RemoveStudentResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    const booking = await getBookingById(bookingId);
    if (booking?.status === 'attended') return { ok: false, error: 'already_attended' };

    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('status', 'booked')
        .select('id');

    if (error) return { ok: false, error: 'unknown' };
    if (data.length === 0) return { ok: false, error: 'not_booked' };

    REMOVE_STUDENT_PATHS.forEach((path) => revalidatePath(path));

    return { ok: true };
};
