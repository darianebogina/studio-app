'use client';

import { ProfileHeader } from '@/widgets/profile-header';
import { TeacherTodayFab } from '@/widgets/teacher-today-fab';
import { TeacherTodayLessons } from '@/widgets/teacher-today-lessons';
import { TodayStats } from '@/widgets/today-stats';
import type { LessonWithBookings, UserProfile } from '@/shared/types';
import styles from './styles.module.scss';

type TeacherTodayViewProps = {
    user: UserProfile;
    lessons: LessonWithBookings[];
    lessonsCount: number;
    bookedCount: number;
};

// Заглушки: модалка занятия — шаг 6.9, создание занятия — шаг 6.10
export const TeacherTodayView = ({
    user,
    lessons,
    lessonsCount,
    bookedCount,
}: TeacherTodayViewProps) => {
    const handleSelectLesson = () => alert('Модалка занятия будет реализована на шаге 6.9');
    const handleCreateLesson = () => alert('Создание занятия будет реализовано на шаге 6.10');

    return (
        <main className={styles.teacherTodayView}>
            <div className={styles.profile}>
                <ProfileHeader user={user} />
            </div>

            <TodayStats lessonsCount={lessonsCount} bookedCount={bookedCount} />

            <TeacherTodayLessons lessons={lessons} onSelectLesson={handleSelectLesson} />

            <TeacherTodayFab onClick={handleCreateLesson} />
        </main>
    );
};
