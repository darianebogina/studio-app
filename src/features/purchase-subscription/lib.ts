export type PurchaseError = 'unauthorized' | 'invalid_student' | 'invalid_plan' | 'invalid_date' | 'unknown';

export type PurchaseResult = { ok: true } | { ok: false; error: PurchaseError };

export const STUDENTS_PATH = '/teacher/students';

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const PURCHASE_ERROR_MESSAGES: Record<PurchaseError, string> = {
    unauthorized: 'Нет прав для оформления',
    invalid_student: 'Ученик не найден',
    invalid_plan: 'Некорректный тариф',
    invalid_date: 'Дата покупки должна быть в прошлом или сегодня',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getPurchaseErrorMessage = (error: PurchaseError) => PURCHASE_ERROR_MESSAGES[error];
