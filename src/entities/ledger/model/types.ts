import type { LessonKind } from '@/shared/types';

export const PURCHASE_UNIT_LABELS: Record<LessonKind, string> = {
    group: 'гр',
    individual: 'инд',
};

export const DEDUCTION_UNIT_LABELS: Record<LessonKind, string> = {
    group: 'групповое',
    individual: 'индив',
};

export const RESET_LABEL = 'аннулирован';
