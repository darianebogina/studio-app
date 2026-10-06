import type { StudentWithSubscription, Subscription, UserProfile } from '@/shared/types';
import { createClient as createServerClient } from './supabase/server';

type StudentRow = UserProfile & {
    subscriptions: Subscription[];
};

// Фильтр по subscriptions.is_active отсекает только вложенные строки: ученики без активного абонемента остаются в списке.
// Вложенные абонементы идут от старого к новому — для бэйджа берём первый, с него будет следующее списание (FIFO).
export const getAllStudents = async (): Promise<StudentWithSubscription[]> => {
    const supabase = await createServerClient();

    const { data } = await supabase
        .from('users')
        .select('*, subscriptions(*)')
        .eq('role', 'student')
        .eq('subscriptions.is_active', true)
        .order('purchased_at', { referencedTable: 'subscriptions', ascending: true })
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true })
        .overrideTypes<StudentRow[], { merge: false }>();

    return (data ?? []).map(({ subscriptions, ...user }) => ({
        user,
        subscription: subscriptions[0] ?? null,
    }));
};
