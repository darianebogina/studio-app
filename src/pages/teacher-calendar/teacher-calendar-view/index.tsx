'use client';

import { useState } from 'react';
import { DayStrip } from '@/widgets/day-strip';
import { TeacherLessonList } from '@/widgets/teacher-lesson-list';
import { TeacherLessonModal } from '@/widgets/teacher-lesson-modal';
import { TeacherTodayFab } from '@/widgets/teacher-today-fab';
import { CreateLessonModal } from '@/features/create-lesson';
import type { Lesson, LessonWithBookings } from '@/shared/types';
import styles from './styles.module.scss';

type TeacherCalendarViewProps = {
    lessons: LessonWithBookings[];
};

export const TeacherCalendarView = ({ lessons }: TeacherCalendarViewProps) => {
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);

    const handleCloseLesson = () => setSelectedLesson(null);
    const handleOpenCreate = () => setIsOpenCreate(true);
    const handleCloseCreate = () => setIsOpenCreate(false);

    return (
        <main className={styles.teacherCalendarView}>
            <DayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <TeacherLessonList
                lessons={lessons}
                selectedDate={selectedDate}
                onSelectLesson={setSelectedLesson}
            />

            <TeacherTodayFab onClick={handleOpenCreate} />

            <TeacherLessonModal lesson={selectedLesson} onClose={handleCloseLesson} />

            <CreateLessonModal
                isOpen={isOpenCreate}
                defaultDate={selectedDate}
                onClose={handleCloseCreate}
            />
        </main>
    );
};
