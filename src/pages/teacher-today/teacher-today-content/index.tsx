import { getTodayLessonsWithBookings, getUserRole } from '@/shared/api/server';
import { TeacherTodayView } from '../teacher-today-view';

export const TeacherTodayContent = async () => {
    const [user, lessons] = await Promise.all([getUserRole(), getTodayLessonsWithBookings()]);

    // proxy.ts уже редиректит неавторизованных на /login
    if (!user) return null;

    const bookedCount = lessons.reduce((sum, lesson) => sum + lesson.bookedCount, 0);

    return (
        <TeacherTodayView
            user={user}
            lessons={lessons}
            lessonsCount={lessons.length}
            bookedCount={bookedCount}
        />
    );
};
