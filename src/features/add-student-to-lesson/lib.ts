export type AddStudentError =
    | 'unauthorized'
    | 'lesson_not_found'
    | 'lesson_cancelled'
    | 'already_booked'
    | 'unknown';

export type AddStudentResult = { ok: true } | { ok: false; error: AddStudentError };

// Студенческие страницы тоже: ученик увидит запись у себя
export const ADD_STUDENT_PATHS = ['/teacher', '/teacher/calendar', '/calendar', '/home', '/bookings'];

// Код ошибки Postgres при нарушении unique (lesson_id, user_id)
export const UNIQUE_VIOLATION_CODE = '23505';

export const SEARCH_ICON_SIZE = 16;

export const getStudentFullName = (firstName: string, lastName: string) => `${firstName} ${lastName}`;

const ADD_STUDENT_ERROR_MESSAGES: Record<AddStudentError, string> = {
    unauthorized: 'Нет прав',
    lesson_not_found: 'Занятие не найдено',
    lesson_cancelled: 'Занятие отменено',
    already_booked: 'Ученик уже записан',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getAddStudentErrorMessage = (error: AddStudentError) => ADD_STUDENT_ERROR_MESSAGES[error];
