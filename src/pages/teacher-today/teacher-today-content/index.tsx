import { getStudentsCount, getTodayLessonsWithBookings, getUserRole } from '@/shared/api/server';
import { TeacherTodayView } from '../teacher-today-view';

export const TeacherTodayContent = async () => {
    const [user, lessons, studentsCount] = await Promise.all([
        getUserRole(),
        getTodayLessonsWithBookings(),
        getStudentsCount(),
    ]);

    // proxy.ts уже редиректит неавторизованных на /login
    if (!user) return null;

    return (
        <TeacherTodayView
            user={user}
            lessons={lessons}
            lessonsCount={lessons.length}
            studentsCount={studentsCount}
        />
    );
};
