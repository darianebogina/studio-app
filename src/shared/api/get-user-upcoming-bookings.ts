import { compareAsc, isFuture } from 'date-fns';
import type { BookingWithLesson } from '@/shared/types';
import { createClient as createServerClient } from './supabase/server';

// Фильтр по времени и сортировка после запроса: .order() с referencedTable упорядочивает только вложенные строки.
// !inner отбрасывает записи, чьё занятие скрыто RLS, чтобы lesson никогда не был null.
export const getUserUpcomingBookings = async (userId: string): Promise<BookingWithLesson[]> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('bookings')
        .select('*, lesson:lessons!inner(*)')
        .eq('user_id', userId)
        .eq('status', 'booked')
        .overrideTypes<BookingWithLesson[], { merge: false }>();

    return (data ?? [])
        .filter(({ lesson }) => isFuture(lesson.starts_at))
        .toSorted((left, right) => compareAsc(left.lesson.starts_at, right.lesson.starts_at));
};
