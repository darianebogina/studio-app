import type { ConfirmOptions } from '@/shared/ui-kit';

export type ResetError = 'unauthorized' | 'no_active_subscription' | 'unknown';

export type ResetResult = { ok: true } | { ok: false; error: ResetError };

export const STUDENTS_PATH = '/teacher/students';

export const CONFIRM_OPTIONS: ConfirmOptions = {
    title: 'Аннулировать абонемент?',
    description: 'Остаток занятий будет обнулён. Это действие нельзя отменить.',
    confirmText: 'Аннулировать',
    cancelText: 'Назад',
    danger: true,
};

const RESET_ERROR_MESSAGES: Record<ResetError, string> = {
    unauthorized: 'Нет прав для аннулирования',
    no_active_subscription: 'У ученика нет активного абонемента',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getResetErrorMessage = (error: ResetError) => RESET_ERROR_MESSAGES[error];
