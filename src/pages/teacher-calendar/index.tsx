import { addDays } from 'date-fns';
import { getLessonsByRangeWithBookings } from '@/shared/api/server';
import { getWeekDays } from '@/shared/lib/date';
import { TeacherCalendarView } from './teacher-calendar-view';

export const TeacherCalendarPage = async () => {
    const weekDays = getWeekDays(new Date());
    const dateFrom = weekDays[0];
    const dateTo = addDays(dateFrom, weekDays.length);

    const lessons = await getLessonsByRangeWithBookings({ dateFrom, dateTo });

    return <TeacherCalendarView lessons={lessons} />;
};
