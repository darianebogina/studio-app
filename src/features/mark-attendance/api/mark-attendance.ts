'use server';

import { revalidatePath } from 'next/cache';
import { LESSON_TITLES } from '@/entities/lesson';
import { getLessonById, getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import { formatLessonTime, formatShortDate } from '@/shared/lib/date';
import type { BookingStatus } from '@/shared/types';
import {
    ATTENDANCE_PATHS,
    LESSON_KINDS,
    STUDENTS_PATH,
    type Attendance,
    type MarkAttendanceResult,
} from '../lib';

type MarkAttendanceParams = {
    lessonId: string;
    attendances: Attendance[];
};

type BookingRow = {
    id: string;
    user_id: string;
    status: BookingStatus;
};

const REVERSIBLE_BOOKING_STATUSES: BookingStatus[] = ['booked', 'attended'];

// Клиент присылает состояние всех чекбоксов, а что менять, решаем по статусам из БД:
// booked + галка → mark_attendance (перевод в attended и списание), attended без галки → revert_attendance
// (возврат в booked и занятия на тот же абонемент). Обе функции работают в одной транзакции и проверяют роль сами,
// проверка здесь — чтобы вернуть понятную ошибку, а не сырую ошибку rpc
export const markAttendance = async ({
    lessonId,
    attendances,
}: MarkAttendanceParams): Promise<MarkAttendanceResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    if (attendances.length === 0) return { ok: false, error: 'no_changes' };

    const lesson = await getLessonById(lessonId);
    if (!lesson || lesson.status === 'cancelled') return { ok: false, error: 'lesson_unavailable' };

    const supabase = await createServerClient();

    // rpc ищут запись только по id и работают с переданным учеником,
    // поэтому пару «запись — ученик» и текущий статус берём из БД, а не с клиента
    const { data: bookings } = await supabase
        .from('bookings')
        .select('id, user_id, status')
        .eq('lesson_id', lessonId)
        .in('status', REVERSIBLE_BOOKING_STATUSES)
        .in('id', attendances.map(({ bookingId }) => bookingId))
        .overrideTypes<BookingRow[], { merge: false }>();

    const markedBookingIds = new Set(attendances
        .filter(({ markedAttended }) => markedAttended)
        .map(({ bookingId }) => bookingId));

    const bookingsToMark = (bookings ?? [])
        .filter(({ id, status }) => status === 'booked' && markedBookingIds.has(id));
    const bookingsToRevert = (bookings ?? [])
        .filter(({ id, status }) => status === 'attended' && !markedBookingIds.has(id));

    if (bookingsToMark.length === 0 && bookingsToRevert.length === 0) return { ok: false, error: 'no_changes' };

    const rpcParams = {
        p_lesson_id: lessonId,
        p_lesson_kind: LESSON_KINDS[lesson.type],
        p_note: `${LESSON_TITLES[lesson.type]} · ${formatShortDate(lesson.starts_at)} ${formatLessonTime(lesson.starts_at)}`,
    };

    const callRpc = (fn: 'mark_attendance' | 'revert_attendance', rows: BookingRow[]) =>
        Promise.all(rows.map(({ id, user_id: userId }) =>
            supabase.rpc(fn, { ...rpcParams, p_booking_id: id, p_user_id: userId })));

    const [markResults, revertResults] = await Promise.all([
        callRpc('mark_attendance', bookingsToMark),
        callRpc('revert_attendance', bookingsToRevert),
    ]);

    const markedUserIds = bookingsToMark
        .filter((_, index) => !markResults[index].error)
        .map(({ user_id: userId }) => userId);
    const revertedUserIds = bookingsToRevert
        .filter((_, index) => !revertResults[index].error)
        .map(({ user_id: userId }) => userId);
    const changedUserIds = [...markedUserIds, ...revertedUserIds];

    if (changedUserIds.length > 0) {
        ATTENDANCE_PATHS.forEach((path) => revalidatePath(path));
        changedUserIds.forEach((userId) => revalidatePath(`${STUDENTS_PATH}/${userId}`));
    }

    if (revertedUserIds.length < bookingsToRevert.length) return { ok: false, error: 'revert_failed' };
    if (bookingsToMark.length > 0 && markedUserIds.length === 0) return { ok: false, error: 'not_marked' };
    if (markedUserIds.length < bookingsToMark.length) return { ok: false, error: 'partially_marked' };

    return { ok: true, markedCount: markedUserIds.length, revertedCount: revertedUserIds.length };
};
