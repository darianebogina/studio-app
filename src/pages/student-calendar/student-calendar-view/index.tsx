'use client';

import { useState } from 'react';
import { DayStrip } from '@/widgets/day-strip';
import { LessonList } from '@/widgets/lesson-list';
import type { Lesson } from '@/shared/types';
import styles from './styles.module.scss';

type StudentCalendarViewProps = {
    lessons: Lesson[];
    bookedLessonIds: Set<string>;
    currentUserId: string;
};

export const StudentCalendarView = ({
    lessons,
    bookedLessonIds,
    currentUserId,
}: StudentCalendarViewProps) => {
    const [selectedDate, setSelectedDate] = useState(() => new Date());

    // TODO(4.3): открывать дровер занятия
    const handleSelectLesson = (lesson: Lesson) => console.log(lesson.id);

    return (
        <main className={styles.studentCalendarView}>
            <DayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <LessonList
                lessons={lessons}
                bookedLessonIds={bookedLessonIds}
                currentUserId={currentUserId}
                selectedDate={selectedDate}
                onSelectLesson={handleSelectLesson}
            />
        </main>
    );
};
