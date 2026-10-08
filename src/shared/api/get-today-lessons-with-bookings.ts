import { getTodayRange } from '@/shared/lib/date';
import type { BookingStatus, Lesson, LessonWithBookings, UserProfile } from '@/shared/types';
import { createClient as createServerClient } from './supabase/server';

type LessonRow = Lesson & {
    bookings: { status: BookingStatus }[];
    assigned_student: Pick<UserProfile, 'first_name' | 'last_name'> | null;
};

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ['booked', 'attended'];

// Статусы записей считаем здесь, а не фильтром по bookings.status: так в выборке остаются занятия без записей.
// Отменённые занятия не фильтруем — преподаватель должен видеть, что занятие отменено.
// Хинт !assigned_student_id нужен, потому что lessons связаны с users ещё и через bookings.
export const getTodayLessonsWithBookings = async (): Promise<LessonWithBookings[]> => {
    const supabase = await createServerClient();
    const { dateFrom, dateTo } = getTodayRange();

    const { data } = await supabase
        .from('lessons')
        .select('*, bookings(status), assigned_student:users!assigned_student_id(first_name, last_name)')
        .gte('starts_at', dateFrom.toISOString())
        .lt('starts_at', dateTo.toISOString())
        .order('starts_at', { ascending: true })
        .overrideTypes<LessonRow[], { merge: false }>();

    return (data ?? []).map(({ bookings, assigned_student: assignedStudent, ...lesson }) => ({
        lesson,
        bookedCount: bookings.filter(({ status }) => ACTIVE_BOOKING_STATUSES.includes(status)).length,
        studentName: assignedStudent
            ? `${assignedStudent.first_name} ${assignedStudent.last_name}`
            : lesson.external_student_name,
    }));
};
