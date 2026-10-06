import { createClient as createServerClient } from './supabase/server';
import type { Booking } from '@/shared/types';

type GetUserBookingParams = {
    userId: string;
    lessonId: string;
};

// Строка (lesson_id, user_id) уникальна, поэтому запись максимум одна — в любом статусе
export const getUserBooking = async ({
    userId,
    lessonId,
}: GetUserBookingParams): Promise<Booking | null> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .maybeSingle<Booking>();

    return data;
};
