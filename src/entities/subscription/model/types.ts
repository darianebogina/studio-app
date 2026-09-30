export type SubscriptionPlan =
    | 'plan_4'
    | 'plan_8'
    | 'plan_4_indiv'
    | 'plan_8_indiv'
    | 'plan_16'
    | 'plan_indiv'
    | 'plan_single'
    | 'plan_single_film';

export type Subscription = {
    id: string;
    user_id: string;
    plan: SubscriptionPlan;
    group_total: number;
    group_remaining: number;
    individual_total: number;
    individual_remaining: number;
    purchased_at: string;
    is_active: boolean;
    created_at: string;
};

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
