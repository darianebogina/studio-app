'use server';

import { revalidatePath } from 'next/cache';
import { isPast } from 'date-fns';
import { getActiveSubscription, getLessonById, getUserBooking } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import {
    BOOKING_PATHS,
    REMAINING_FIELDS,
    UNIQUE_VIOLATION_CODE,
    type BookLessonResult,
} from '../lib';

// Абонемент здесь только проверяется: списание будет при отметке присутствия преподавателем
export const bookLesson = async (lessonId: string): Promise<BookLessonResult> => {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'unauthorized' };

    const lesson = await getLessonById(lessonId);
    if (!lesson || lesson.status === 'cancelled' || isPast(lesson.starts_at)) {
        return { ok: false, error: 'lesson_unavailable' };
    }

    const subscription = await getActiveSubscription(user.id);
    if (!subscription) return { ok: false, error: 'no_subscription' };

    if (subscription[REMAINING_FIELDS[lesson.type]] <= 0) {
        return { ok: false, error: 'no_remaining' };
    }

    const booking = await getUserBooking({ userId: user.id, lessonId });
    if (booking && booking.status !== 'cancelled') {
        return { ok: false, error: 'already_booked' };
    }

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
                user_id: user.id,
                status: 'booked',
                booked_at: bookedAt,
            });

    // Параллельный запрос успел вставить запись раньше
    if (error?.code === UNIQUE_VIOLATION_CODE) return { ok: false, error: 'already_booked' };
    if (error) return { ok: false, error: 'unknown' };

    BOOKING_PATHS.forEach((path) => revalidatePath(path));

    return { ok: true };
};
