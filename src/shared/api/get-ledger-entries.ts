import { createClient as createServerClient } from './supabase/server';
import type { LedgerEntry } from '@/shared/types';

export const getLedgerEntries = async (userId: string): Promise<LedgerEntry[]> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('ledger')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .overrideTypes<LedgerEntry[], { merge: false }>();

    return data ?? [];
};
