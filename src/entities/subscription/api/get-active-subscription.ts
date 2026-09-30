import { createClient as createServerClient } from '@/shared/api/supabase/server';
import type { Subscription } from '../model/types';

// Самый старый активный абонемент идёт первым — списания работают по FIFO
export const getActiveSubscription = async (userId: string): Promise<Subscription | null> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('purchased_at', { ascending: true })
        .limit(1)
        .maybeSingle<Subscription>();

    return data;
};
