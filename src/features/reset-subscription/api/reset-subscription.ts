'use server';

import { revalidatePath } from 'next/cache';
import { getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { STUDENTS_PATH, type ResetResult } from '../lib';

type ResetSubscriptionParams = {
    userId: string;
};

// Аннулирование и запись reset в ledger делает reset_subscription в одной транзакции, роль она проверяет сама.
// Проверка здесь — чтобы вернуть понятную ошибку, а не сырую ошибку rpc
export const resetSubscription = async ({ userId }: ResetSubscriptionParams): Promise<ResetResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    const supabase = await createServerClient();

    const { data: isReset, error } = await supabase.rpc('reset_subscription', { p_user_id: userId });

    if (error) return { ok: false, error: 'unknown' };
    if (!isReset) return { ok: false, error: 'no_active_subscription' };

    revalidatePath(STUDENTS_PATH);
    revalidatePath(`${STUDENTS_PATH}/${userId}`);

    return { ok: true };
};
