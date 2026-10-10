import type { LessonType } from '@/shared/types';

export type CreateLessonError =
    | 'unauthorized'
    | 'invalid_date'
    | 'invalid_duration'
    | 'invalid_type'
    | 'missing_student_for_indiv'
    | 'unknown';

export type CreateLessonResult = { ok: true; lessonId: string } | { ok: false; error: CreateLessonError };

export const CREATE_LESSON_PATHS = ['/teacher', '/teacher/calendar'];

export const LESSON_TYPES: { value: LessonType; label: string }[] = [
    { value: 'vogue', label: 'Vogue' },
    { value: 'individual', label: 'Индив' },
];

export const MIN_DURATION_MIN = 15;
export const MAX_DURATION_MIN = 180;
export const DURATION_STEP_MIN = 15;

// Запас на случай, если преподаватель заводит уже начавшееся занятие
export const PAST_TOLERANCE_HOURS = 1;

const CREATE_LESSON_ERROR_MESSAGES: Record<CreateLessonError, string> = {
    unauthorized: 'Нет прав для создания',
    invalid_date: 'Дата должна быть не в прошлом',
    invalid_duration: `Длительность должна быть от ${MIN_DURATION_MIN} до ${MAX_DURATION_MIN} минут`,
    invalid_type: 'Некорректный тип занятия',
    missing_student_for_indiv: 'Для индива выберите ученика или укажите имя',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getCreateLessonErrorMessage = (error: CreateLessonError) => CREATE_LESSON_ERROR_MESSAGES[error];
