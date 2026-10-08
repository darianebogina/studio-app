'use client';

import { LessonCard } from '@/entities/lesson';
import { isSameDay } from '@/shared/lib/date';
import type { Lesson, LessonWithBookings } from '@/shared/types';
import styles from './styles.module.scss';

type TeacherLessonListProps = {
    lessons: LessonWithBookings[];
    selectedDate: Date;
    onSelectLesson: (lesson: Lesson) => void;
};

export const TeacherLessonList = ({
    lessons,
    selectedDate,
    onSelectLesson,
}: TeacherLessonListProps) => {
    const dayLessons = lessons.filter(({ lesson }) => isSameDay(lesson.starts_at, selectedDate));

    if (dayLessons.length === 0) {
        return <p className={styles.empty}>На этот день занятий нет</p>;
    }

    return (
        <ul className={styles.teacherLessonList}>
            {dayLessons.map(({ lesson, bookedCount, studentName }) => (
                <li key={lesson.id}>
                    <LessonCard
                        lesson={lesson}
                        bookedCount={bookedCount}
                        studentName={studentName}
                        onClick={() => onSelectLesson(lesson)}
                    />
                </li>
            ))}
        </ul>
    );
};
