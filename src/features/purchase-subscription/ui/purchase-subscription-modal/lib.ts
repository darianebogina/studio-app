import { PLANS } from '@/entities/subscription';
import type { SubscriptionPlan } from '@/shared/types';
import type { PurchaseResult } from '../../lib';

export const DEFAULT_PLAN: SubscriptionPlan = PLANS[0].value;

export const NETWORK_ERROR_RESULT: PurchaseResult = { ok: false, error: 'unknown' };

const priceFormatter = new Intl.NumberFormat('ru-RU');

export const formatPrice = (price: number) => `${priceFormatter.format(price)} ₽`;

export const getSubmitLabel = (plan: SubscriptionPlan) => {
    const config = PLANS.find(({ value }) => value === plan);

    const deltas = [
        config?.groupCount ? `+${config.groupCount} гр` : '',
        config?.individualCount ? `+${config.individualCount} инд` : '',
    ].filter(Boolean);

    return ['Оформить', ...deltas].join(' · ');
};
