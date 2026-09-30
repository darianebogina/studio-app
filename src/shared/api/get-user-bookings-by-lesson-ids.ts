import { createClient as createServerClient } from './supabase/server';
import type { Booking, BookingStatus } from '@/shared/types';

type GetUserBookingsByLessonIdsParams = {
    userId: string;
    lessonIds: string[];
};

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ['booked', 'attended'];

export const getUserBookingsByLessonIds = async ({
    userId,
    lessonIds,
}: GetUserBookingsByLessonIdsParams): Promise<Booking[]> => {
    if (lessonIds.length === 0) return [];

    const supabase = await createServerClient();

    const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds)
        .in('status', ACTIVE_BOOKING_STATUSES)
        .overrideTypes<Booking[], { merge: false }>();

    return data ?? [];
};
