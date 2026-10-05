'use client';

import { useState } from 'react';
import { DayStrip } from '@/widgets/day-strip';
import { LessonList } from '@/widgets/lesson-list';
import { LessonModal } from '@/entities/lesson';
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
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const handleCloseLesson = () => setSelectedLesson(null);

    // TODO(5): настоящая запись и отмена
    const handleBook = () => alert('Логика записи будет на шаге 5');
    const handleCancel = () => alert('Логика отмены будет на шаге 5');

    const isSelectedLessonBooked = selectedLesson ? bookedLessonIds.has(selectedLesson.id) : false;

    return (
        <main className={styles.studentCalendarView}>
            <DayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <LessonList
                lessons={lessons}
                bookedLessonIds={bookedLessonIds}
                currentUserId={currentUserId}
                selectedDate={selectedDate}
                onSelectLesson={setSelectedLesson}
            />

            <LessonModal
                lesson={selectedLesson}
                isBooked={isSelectedLessonBooked}
                onClose={handleCloseLesson}
                onBook={handleBook}
                onCancel={handleCancel}
            />
        </main>
    );
};
