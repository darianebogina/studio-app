import { addDays } from 'date-fns';
import { getLessonsByRange, getUserBookingsByLessonIds, getUserRole } from '@/shared/api/server';
import { getWeekDays } from '@/shared/lib/date';
import { StudentCalendarView } from '../student-calendar-view';

export const StudentCalendarContent = async () => {
    const user = await getUserRole();

    // proxy.ts уже редиректит неавторизованных на /login
    if (!user) return null;

    const weekDays = getWeekDays(new Date());
    const dateFrom = weekDays[0];
    const dateTo = addDays(dateFrom, weekDays.length);

    const lessons = await getLessonsByRange({ dateFrom, dateTo });
    const bookings = await getUserBookingsByLessonIds({
        userId: user.id,
        lessonIds: lessons.map(({ id }) => id),
    });

    return (
        <StudentCalendarView
            lessons={lessons}
            bookedLessonIds={new Set(bookings.map(({ lesson_id: lessonId }) => lessonId))}
            currentUserId={user.id}
        />
    );
};
