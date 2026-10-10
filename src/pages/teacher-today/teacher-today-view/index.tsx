'use client';

import { useState } from 'react';
import { ProfileHeader } from '@/widgets/profile-header';
import { TeacherLessonModal } from '@/widgets/teacher-lesson-modal';
import { TeacherTodayFab } from '@/widgets/teacher-today-fab';
import { TeacherTodayLessons } from '@/widgets/teacher-today-lessons';
import { TodayStats } from '@/widgets/today-stats';
import { CreateLessonModal } from '@/features/create-lesson';
import type { Lesson, LessonWithBookings, UserProfile } from '@/shared/types';
import styles from './styles.module.scss';

type TeacherTodayViewProps = {
    user: UserProfile;
    lessons: LessonWithBookings[];
    lessonsCount: number;
    bookedCount: number;
};

export const TeacherTodayView = ({
    user,
    lessons,
    lessonsCount,
    bookedCount,
}: TeacherTodayViewProps) => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);

    const handleCloseLesson = () => setSelectedLesson(null);
    const handleOpenCreate = () => setIsOpenCreate(true);
    const handleCloseCreate = () => setIsOpenCreate(false);

    return (
        <main className={styles.teacherTodayView}>
            <div className={styles.profile}>
                <ProfileHeader user={user} />
            </div>

            <TodayStats lessonsCount={lessonsCount} bookedCount={bookedCount} />

            <TeacherTodayLessons lessons={lessons} onSelectLesson={setSelectedLesson} />

            <TeacherTodayFab onClick={handleOpenCreate} />

            <TeacherLessonModal lesson={selectedLesson} onClose={handleCloseLesson} />

            <CreateLessonModal isOpen={isOpenCreate} onClose={handleCloseCreate} />
        </main>
    );
};
