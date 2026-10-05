import type { LessonType } from '@/shared/types';

const MINUTE_FORMS: Record<Intl.LDMLPluralRule, string> = {
    zero: 'минут',
    one: 'минута',
    two: 'минуты',
    few: 'минуты',
    many: 'минут',
    other: 'минуты',
};

const pluralRules = new Intl.PluralRules('ru');

export const formatDuration = (minutes: number) =>
    `${minutes} ${MINUTE_FORMS[pluralRules.select(minutes)]}`;

export const DEDUCTION_HINTS: Record<LessonType, string> = {
    vogue: 'Спишется 1 групповое занятие после отметки присутствия',
    individual: 'Спишется 1 индивидуальное занятие после отметки присутствия',
};
