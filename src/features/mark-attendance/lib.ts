import type { LessonKind, LessonType } from '@/shared/types';

export type Attendance = {
    bookingId: string;
    userId: string;
    markedAttended: boolean;
};

export type MarkAttendanceError =
    | 'unauthorized'
    | 'lesson_unavailable'
    | 'no_changes'
    | 'partially_marked'
    | 'not_marked'
    | 'revert_failed'
    | 'unknown';

export type MarkAttendanceResult =
    | { ok: true; markedCount: number; revertedCount: number }
    | { ok: false; error: MarkAttendanceError };

export const LESSON_KINDS: Record<LessonType, LessonKind> = {
    vogue: 'group',
    individual: 'individual',
};

export const STUDENTS_PATH = '/teacher/students';

export const ATTENDANCE_PATHS = ['/teacher', '/teacher/calendar', STUDENTS_PATH, '/home', '/bookings'];

const MARK_ATTENDANCE_ERROR_MESSAGES: Record<MarkAttendanceError, string> = {
    unauthorized: 'Нет прав для отметки присутствия',
    lesson_unavailable: 'Занятие не найдено или отменено',
    no_changes: 'Нет изменений для сохранения',
    partially_marked: 'Отмечены не все: возможно, у части учеников нет занятий на абонементе',
    not_marked: 'Не удалось отметить: возможно, у учеников нет занятий на абонементе',
    revert_failed: 'Не удалось снять отметку у части учеников, попробуйте ещё раз',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getMarkAttendanceErrorMessage = (error: MarkAttendanceError) =>
    MARK_ATTENDANCE_ERROR_MESSAGES[error];
