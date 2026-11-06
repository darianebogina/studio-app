import type { Booking } from '@/shared/types';
import { createClient as createServerClient } from './supabase/server';

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle<Booking>();

    return data;
};
