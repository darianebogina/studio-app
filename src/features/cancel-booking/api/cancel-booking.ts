'use server';

import { revalidatePath } from 'next/cache';
import { isPast } from 'date-fns';
import { getLessonById } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { BOOKING_PATHS, type CancelBookingResult } from '../lib';

// Запись не удаляется, а переводится в cancelled: строка остаётся как история
export const cancelBooking = async (lessonId: string): Promise<CancelBookingResult> => {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'unauthorized' };

    // Иначе после занятия можно было бы отменить запись и уйти от списания
    const lesson = await getLessonById(lessonId);
    if (lesson && isPast(lesson.starts_at)) return { ok: false, error: 'lesson_started' };

    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .eq('status', 'booked')
        .select('id');

    if (error) return { ok: false, error: 'unknown' };
    if (data.length === 0) return { ok: false, error: 'not_booked' };

    BOOKING_PATHS.forEach((path) => revalidatePath(path));

    return { ok: true };
};
