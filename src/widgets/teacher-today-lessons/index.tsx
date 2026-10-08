'use client';

import { LessonCard } from '@/entities/lesson';
import type { Lesson, LessonWithBookings } from '@/shared/types';
import styles from './styles.module.scss';

type TeacherTodayLessonsProps = {
    lessons: LessonWithBookings[];
    onSelectLesson: (lesson: Lesson) => void;
};

export const TeacherTodayLessons = ({ lessons, onSelectLesson }: TeacherTodayLessonsProps) => (
    <section className={styles.teacherTodayLessons}>
        <h2 className={styles.label}>Расписание на сегодня</h2>

        {lessons.length === 0 && <p className={styles.empty}>На сегодня занятий нет</p>}

        {lessons.length > 0 && (
            <ul className={styles.list}>
                {lessons.map(({ lesson, bookedCount, studentName }) => (
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
        )}
    </section>
);
