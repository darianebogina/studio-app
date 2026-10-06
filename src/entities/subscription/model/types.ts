import type { SubscriptionPlan } from '@/shared/types';

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
    plan_4: '4 занятия',
    plan_8: '8 занятий',
    plan_4_indiv: '4 занятия + индив',
    plan_8_indiv: '8 занятий + индив',
    plan_16: '16 занятий',
    plan_indiv: 'Индив',
    plan_single: 'Разовое',
    plan_single_film: 'Разовое со съёмкой',
};

export type PlanConfig = {
    value: SubscriptionPlan;
    price: number;
    groupCount: number;
    individualCount: number;
};

// Счётчики здесь только для подписи кнопки: реально абонемент начисляет purchase_subscription в БД
export const PLANS: PlanConfig[] = [
    { value: 'plan_4', price: 2600, groupCount: 4, individualCount: 0 },
    { value: 'plan_8', price: 3400, groupCount: 8, individualCount: 0 },
    { value: 'plan_4_indiv', price: 3400, groupCount: 4, individualCount: 1 },
    { value: 'plan_8_indiv', price: 4000, groupCount: 8, individualCount: 1 },
    { value: 'plan_16', price: 6000, groupCount: 16, individualCount: 0 },
    { value: 'plan_indiv', price: 1800, groupCount: 0, individualCount: 1 },
    { value: 'plan_single', price: 800, groupCount: 1, individualCount: 0 },
    { value: 'plan_single_film', price: 1200, groupCount: 1, individualCount: 0 },
];
