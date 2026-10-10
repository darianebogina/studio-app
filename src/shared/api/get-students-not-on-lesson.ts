import type { BookingStatus, UserProfile } from '@/shared/types';
import { createClient as createServerClient } from './supabase/server';

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ['booked', 'attended'];

// Ученики с отменённой записью попадают в список: их можно вернуть на занятие
export const getStudentsNotOnLesson = async (lessonId: string): Promise<UserProfile[]> => {
    const supabase = await createServerClient();

    const { data: bookings } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('lesson_id', lessonId)
        .in('status', ACTIVE_BOOKING_STATUSES)
        .overrideTypes<{ user_id: string }[], { merge: false }>();

    const bookedUserIds = (bookings ?? []).map(({ user_id: userId }) => userId);

    const query = supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

    const { data } = await (bookedUserIds.length > 0
        ? query.not('id', 'in', `(${bookedUserIds.join(',')})`)
        : query
    ).overrideTypes<UserProfile[], { merge: false }>();

    return data ?? [];
};
