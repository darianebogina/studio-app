'use client';

import { useState } from 'react';
import { ProfileHeader } from '@/widgets/profile-header';
import { TeacherLessonModal } from '@/widgets/teacher-lesson-modal';
import { TeacherTodayFab } from '@/widgets/teacher-today-fab';
import { TeacherTodayLessons } from '@/widgets/teacher-today-lessons';
import { TodayStats } from '@/widgets/today-stats';
import type { Lesson, LessonWithBookings, UserProfile } from '@/shared/types';
import styles from './styles.module.scss';

type TeacherTodayViewProps = {
    user: UserProfile;
    lessons: LessonWithBookings[];
    lessonsCount: number;
    bookedCount: number;
};

// Заглушка: создание занятия — шаг 6.10
export const TeacherTodayView = ({
    user,
    lessons,
    lessonsCount,
    bookedCount,
}: TeacherTodayViewProps) => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const handleCloseLesson = () => setSelectedLesson(null);
    const handleCreateLesson = () => alert('Создание занятия будет реализовано на шаге 6.10');

    return (
        <main className={styles.teacherTodayView}>
            <div className={styles.profile}>
                <ProfileHeader user={user} />
            </div>

            <TodayStats lessonsCount={lessonsCount} bookedCount={bookedCount} />

            <TeacherTodayLessons lessons={lessons} onSelectLesson={setSelectedLesson} />

            <TeacherTodayFab onClick={handleCreateLesson} />

            <TeacherLessonModal lesson={selectedLesson} onClose={handleCloseLesson} />
        </main>
    );
};
