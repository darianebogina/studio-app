import type { LessonKind } from '@/shared/types';

export type DeductError = 'unauthorized' | 'invalid_kind' | 'unknown';

export type DeductResult = { ok: true } | { ok: false; error: DeductError };

export const STUDENTS_PATH = '/teacher/students';

export const DEDUCTION_NOTE = 'Списание преподавателем';

export const LESSON_KINDS: { value: LessonKind; label: string }[] = [
    { value: 'group', label: 'Групповое' },
    { value: 'individual', label: 'Индив' },
];

const DEDUCT_ERROR_MESSAGES: Record<DeductError, string> = {
    unauthorized: 'Нет прав для списания',
    invalid_kind: 'Некорректный тип занятия',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getDeductErrorMessage = (error: DeductError) => DEDUCT_ERROR_MESSAGES[error];
