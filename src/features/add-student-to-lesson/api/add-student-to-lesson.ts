'use server';

import { revalidatePath } from 'next/cache';
import { getLessonById, getUserBooking, getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { ADD_STUDENT_PATHS, UNIQUE_VIOLATION_CODE, type AddStudentResult } from '../lib';

type AddStudentToLessonParams = {
    lessonId: string;
    userId: string;
};

// Абонемент не проверяем: ученик уже пришёл, а списание будет при отметке присутствия
export const addStudentToLesson = async ({
    lessonId,
    userId,
}: AddStudentToLessonParams): Promise<AddStudentResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    const lesson = await getLessonById(lessonId);
    if (!lesson) return { ok: false, error: 'lesson_not_found' };
    if (lesson.status === 'cancelled') return { ok: false, error: 'lesson_cancelled' };

    const booking = await getUserBooking({ userId, lessonId });
    if (booking && booking.status !== 'cancelled') return { ok: false, error: 'already_booked' };

    const supabase = await createServerClient();
    const bookedAt = new Date().toISOString();

    // Из-за unique (lesson_id, user_id) отменённую запись не пересоздаём, а возвращаем в booked
    const { error } = booking
        ? await supabase
            .from('bookings')
            .update({ status: 'booked', booked_at: bookedAt })
            .eq('id', booking.id)
        : await supabase
            .from('bookings')
            .insert({
                lesson_id: lessonId,
                user_id: userId,
                status: 'booked',
                booked_at: bookedAt,
            });

    // Параллельный запрос успел вставить запись раньше
    if (error?.code === UNIQUE_VIOLATION_CODE) return { ok: false, error: 'already_booked' };
    if (error) return { ok: false, error: 'unknown' };

    ADD_STUDENT_PATHS.forEach((path) => revalidatePath(path));

    return { ok: true };
};
