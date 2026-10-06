'use client';

import { useState } from 'react';
import { DayStrip } from '@/widgets/day-strip';
import { LessonList } from '@/widgets/lesson-list';
import { BookButton } from '@/features/book-lesson';
import { CancelButton } from '@/features/cancel-booking';
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

    const isSelectedLessonBooked = selectedLesson ? bookedLessonIds.has(selectedLesson.id) : false;

    const LessonActionButton = isSelectedLessonBooked ? CancelButton : BookButton;

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
                actions={selectedLesson && (
                    <LessonActionButton lessonId={selectedLesson.id} onSuccess={handleCloseLesson} />
                )}
                onClose={handleCloseLesson}
            />
        </main>
    );
};
