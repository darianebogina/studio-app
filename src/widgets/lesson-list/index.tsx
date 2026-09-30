'use client';

import { LessonCard } from '@/entities/lesson';
import { isSameDay } from '@/shared/lib/date';
import type { Lesson } from '@/shared/types';
import styles from './styles.module.scss';

type LessonListProps = {
    lessons: Lesson[];
    bookedLessonIds: Set<string>;
    currentUserId: string;
    selectedDate: Date;
    onSelectLesson: (lesson: Lesson) => void;
};

export const LessonList = ({
    lessons,
    bookedLessonIds,
    currentUserId,
    selectedDate,
    onSelectLesson,
}: LessonListProps) => {
    const dayLessons = lessons.filter(({ starts_at: startsAt }) =>
        isSameDay(startsAt, selectedDate),
    );

    if (dayLessons.length === 0) {
        return <p className={styles.empty}>На этот день занятий нет</p>;
    }

    return (
        <ul className={styles.lessonList}>
            {dayLessons.map((lesson) => {
                const isOwnIndiv =
                    lesson.type === 'individual' && lesson.assigned_student_id === currentUserId;

                return (
                    <li key={lesson.id}>
                        <LessonCard
                            lesson={lesson}
                            isBooked={bookedLessonIds.has(lesson.id)}
                            variant={isOwnIndiv ? 'own-indiv' : 'default'}
                            onClick={() => onSelectLesson(lesson)}
                        />
                    </li>
                );
            })}
        </ul>
    );
};
