'use server';

import { revalidatePath } from 'next/cache';
import { isValid, parseISO } from 'date-fns';
import { PLANS } from '@/entities/subscription';
import { getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { getTodayDate } from '@/shared/lib/date';
import type { SubscriptionPlan } from '@/shared/types';
import { ISO_DATE_PATTERN, STUDENTS_PATH, type PurchaseResult } from '../lib';

type PurchaseSubscriptionParams = {
    userId: string;
    plan: SubscriptionPlan;
    purchasedAt: string;
};

// Даты сравниваются строками: YYYY-MM-DD упорядочен лексикографически, а «сегодня» считается по МСК
const isValidPurchaseDate = (purchasedAt: string) =>
    ISO_DATE_PATTERN.test(purchasedAt)
    && isValid(parseISO(purchasedAt))
    && purchasedAt <= getTodayDate();

// Абонемент и запись в ledger создаёт purchase_subscription в одной транзакции, роль она проверяет сама.
// Проверка здесь — чтобы вернуть понятную ошибку, а не сырую ошибку rpc
export const purchaseSubscription = async ({
    userId,
    plan,
    purchasedAt,
}: PurchaseSubscriptionParams): Promise<PurchaseResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    if (!userId) return { ok: false, error: 'invalid_student' };
    if (!PLANS.some(({ value }) => value === plan)) return { ok: false, error: 'invalid_plan' };
    if (!isValidPurchaseDate(purchasedAt)) return { ok: false, error: 'invalid_date' };

    const supabase = await createServerClient();

    const { error } = await supabase.rpc('purchase_subscription', {
        p_user_id: userId,
        p_plan: plan,
        p_purchased_at: purchasedAt,
    });

    if (error) return { ok: false, error: 'unknown' };

    revalidatePath(STUDENTS_PATH);
    revalidatePath(`${STUDENTS_PATH}/${userId}`);

    return { ok: true };
};
