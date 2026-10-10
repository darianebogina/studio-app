import { pluralize } from '@/shared/lib/plural';
import type { LessonType } from '@/shared/types';

export const formatDuration = (minutes: number) =>
    `${minutes} ${pluralize(minutes, ['минута', 'минуты', 'минут'])}`;

export const DEDUCTION_HINTS: Record<LessonType, string> = {
    vogue: 'Спишется 1 групповое занятие после отметки присутствия',
    individual: 'Спишется 1 индивидуальное занятие после отметки присутствия',
};
