'use client';

import { useState } from 'react';
import { DayStrip } from '@/widgets/day-strip';
import { TeacherLessonList } from '@/widgets/teacher-lesson-list';
import type { LessonWithBookings } from '@/shared/types';
import styles from './styles.module.scss';

type TeacherCalendarViewProps = {
    lessons: LessonWithBookings[];
};

// Заглушка: модалка занятия — шаг 6.9
export const TeacherCalendarView = ({ lessons }: TeacherCalendarViewProps) => {
    const [selectedDate, setSelectedDate] = useState(() => new Date());

    const handleSelectLesson = () => alert('Модалка занятия будет реализована на шаге 6.9');

    return (
        <main className={styles.teacherCalendarView}>
            <DayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <TeacherLessonList
                lessons={lessons}
                selectedDate={selectedDate}
                onSelectLesson={handleSelectLesson}
            />
        </main>
    );
};
